export interface CropRect {
    x: number;
    y: number;
    width: number;
    height: number;
    label?: string; // e.g. "Center", "Top-Left", "Global"
}

export interface CropResult {
    rect: CropRect;
    aiProb: number;
    realProb: number;
}

export interface InferenceResult {
    isAI: boolean;
    confidence: number;
    aiProbability: number;
    realProbability: number;
    inferenceTime: number;
    cropResults?: CropResult[];
    totalCrops?: number;
    heatmapData?: number[];
    heatmapWidth?: number;
    heatmapHeight?: number;

    // Dual-Model Specifics
    globalProbability?: number;
    localProbability?: number;
}
