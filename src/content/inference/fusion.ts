export interface FusionConfig {
    version: string;
    type: 'logistic_regression';
    features: string[];
    weights: number[];
    bias: number;
    temperature: number;
    threshold: number;
}

export interface FusionFeatures {
    globalAiProb: number;
    localTop1Mean: number;
    localTop3Mean: number;
    localTop5Mean: number;
    localVariance: number;
    localFracAboveHigh: number;
}

export async function loadFusionConfig(url: string): Promise<FusionConfig> {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Failed to load fusion config from ${url}: ${resp.status}`);
    const json = await resp.json() as FusionConfig;
    validateFusionConfig(json, url);
    return json;
}

function validateFusionConfig(cfg: FusionConfig, url: string): void {
    if (!cfg.weights || !Array.isArray(cfg.weights)) {
        throw new Error(`FusionConfig at ${url}: missing weights array`);
    }
    if (cfg.weights.length !== cfg.features.length) {
        throw new Error(
            `FusionConfig at ${url}: weights length (${cfg.weights.length}) ` +
            `does not match features length (${cfg.features.length})`
        );
    }
    if (typeof cfg.threshold !== 'number' || cfg.threshold < 0 || cfg.threshold > 1) {
        throw new Error(`FusionConfig at ${url}: threshold must be a number in [0, 1]`);
    }
    if (typeof cfg.temperature !== 'number' || cfg.temperature <= 0) {
        throw new Error(`FusionConfig at ${url}: temperature must be a positive number`);
    }
}

export function buildFusionFeatures(
    globalAiProb: number,
    localScores: number[],
    gateHigh: number
): FusionFeatures {
    const sorted = [...localScores].sort((a, b) => b - a);
    const n = sorted.length;

    const topN = (k: number) => {
        const slice = sorted.slice(0, Math.min(k, n));
        return slice.length > 0 ? slice.reduce((a, b) => a + b, 0) / slice.length : globalAiProb;
    };

    const mean = n > 0 ? localScores.reduce((a, b) => a + b, 0) / n : globalAiProb;
    const variance = n > 1
        ? localScores.reduce((sum, s) => sum + (s - mean) ** 2, 0) / n
        : 0;
    const fracAboveHigh = n > 0 ? localScores.filter(s => s > gateHigh).length / n : 0;

    return {
        globalAiProb,
        localTop1Mean: topN(1),
        localTop3Mean: topN(3),
        localTop5Mean: topN(5),
        localVariance: variance,
        localFracAboveHigh: fracAboveHigh,
    };
}

export function computeFusedScore(features: FusionFeatures, config: FusionConfig): number {
    const featureVector: number[] = config.features.map(name => {
        const val = (features as unknown as Record<string, number>)[name];
        if (val === undefined) {
            console.warn(`[Fusion] Unknown feature: ${name}, defaulting to 0`);
            return 0;
        }
        return val;
    });

    const dot = featureVector.reduce((sum, v, i) => sum + v * config.weights[i], 0);
    const logit = (dot + config.bias) / config.temperature;
    return sigmoid(logit);
}

function sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
}
