export interface CropRect {
    x: number;
    y: number;
    width: number;
    height: number;
    label?: string;
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

    // Dual-model specifics
    globalProbability?: number;
    localProbability?: number;

    // V2: calibration and uncertainty
    calibratedScore?: number;
    uncertaintyState?: 'confident' | 'uncertain' | 'abstain';
}
