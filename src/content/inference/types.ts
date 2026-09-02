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

export interface InferenceResult {
    /**
     * 'model_unavailable' means the pipeline ran but the models cannot support
     * a verdict. Consumers must branch on this rather than reading isAI.
     */
    status: InferenceStatus;
    modelCalibrated: boolean;
    unavailableReason?: string;
    benchmarkReference?: string;

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
