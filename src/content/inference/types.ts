export interface CropRect {
    x: number;
    y: number;
    width: number;
    height: number;
    label?: string; // e.g. "Center", "Top-Left", "Global"
}

export interface CropResult {
    rect: CropRect;
    /** null when no AI class index is established for the model. */
    aiProb: number | null;
    realProb: number | null;
    /** Full class distribution, always present. */
    distribution?: number[];
}

export type InferenceStatus = 'ok' | 'model_unavailable';

/** Three states, never a bare percentage. See contract.ts ABSTENTION_BAND. */
export type Verdict = 'likely_authentic' | 'inconclusive' | 'likely_ai';

export interface InferenceResult {
    /**
     * 'model_unavailable' means the pipeline ran but the models cannot support
     * a verdict. Consumers must branch on this rather than reading isAI.
     */
    status: InferenceStatus;
    modelCalibrated: boolean;
    unavailableReason?: string;
    benchmarkReference?: string;

    /** Present when status is 'ok'. The headline the UI should render. */
    verdict?: Verdict;
    abstentionBand?: { low: number; high: number };
    /** Held-out-generator AUROC of the model that produced this result. */
    measuredAuroc?: number;

    /** null whenever status is 'model_unavailable'. */
    isAI: boolean | null;
    confidence: number | null;
    aiProbability: number | null;
    realProbability: number | null;
    inferenceTime: number;
    cropResults?: CropResult[];
    totalCrops?: number;
    heatmapData?: number[];
    heatmapWidth?: number;
    heatmapHeight?: number;

    // Dual-Model Specifics
    globalProbability?: number | null;
    localProbability?: number | null;
}
