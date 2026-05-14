import { describe, it, expect } from 'vitest';
import { buildFusionFeatures, computeFusedScore, FusionConfig, FusionFeatures } from '../fusion';

const baseCfg: FusionConfig = {
    version: '2.0',
    type: 'logistic_regression',
    features: [
        'globalAiProb', 'localTop1Mean', 'localTop3Mean',
        'localTop5Mean', 'localVariance', 'localFracAboveHigh',
    ],
    weights: [0.30, 0.50, 0.40, 0.30, 0.20, 0.50],
    bias: -0.10,
    temperature: 1.0,
    threshold: 0.50,
};

describe('buildFusionFeatures', () => {
    it('falls back to globalAiProb when no local scores', () => {
        const f = buildFusionFeatures(0.7, [], 0.85);
        expect(f.globalAiProb).toBe(0.7);
        expect(f.localTop1Mean).toBe(0.7);
        expect(f.localTop3Mean).toBe(0.7);
        expect(f.localVariance).toBe(0);
    });

    it('computes top-k means correctly', () => {
        const scores = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3];
        const f = buildFusionFeatures(0.5, scores, 0.85);
        expect(f.localTop1Mean).toBeCloseTo(0.9, 5);
        expect(f.localTop3Mean).toBeCloseTo((0.9 + 0.8 + 0.7) / 3, 5);
        expect(f.localTop5Mean).toBeCloseTo((0.9 + 0.8 + 0.7 + 0.6 + 0.5) / 5, 5);
    });

    it('computes fraction above gateHigh', () => {
        const scores = [0.9, 0.95, 0.5, 0.3]; // 2 of 4 above 0.85
        const f = buildFusionFeatures(0.5, scores, 0.85);
        expect(f.localFracAboveHigh).toBeCloseTo(0.5, 5);
    });

    it('variance is 0 for a single-element array', () => {
        const f = buildFusionFeatures(0.5, [0.7], 0.85);
        expect(f.localVariance).toBe(0);
    });

    it('variance is non-zero for spread scores', () => {
        const f = buildFusionFeatures(0.5, [0.1, 0.9], 0.85);
        expect(f.localVariance).toBeGreaterThan(0);
    });
});

describe('computeFusedScore', () => {
    it('returns sigmoid of dot product with bias', () => {
        // All-zero feature vector → score = sigmoid(0 + bias) = sigmoid(-0.1)
        const features: FusionFeatures = {
            globalAiProb: 0, localTop1Mean: 0, localTop3Mean: 0,
            localTop5Mean: 0, localVariance: 0, localFracAboveHigh: 0,
        };
        const score = computeFusedScore(features, baseCfg);
        const expected = 1 / (1 + Math.exp(0.10)); // sigmoid(-0.1)
        expect(score).toBeCloseTo(expected, 5);
    });

    it('high AI features produce score > 0.5', () => {
        const features: FusionFeatures = {
            globalAiProb: 0.9, localTop1Mean: 0.95, localTop3Mean: 0.92,
            localTop5Mean: 0.88, localVariance: 0.01, localFracAboveHigh: 0.8,
        };
        expect(computeFusedScore(features, baseCfg)).toBeGreaterThan(0.5);
    });

    it('low AI features produce score < 0.5', () => {
        const features: FusionFeatures = {
            globalAiProb: 0.05, localTop1Mean: 0.08, localTop3Mean: 0.06,
            localTop5Mean: 0.05, localVariance: 0.001, localFracAboveHigh: 0,
        };
        expect(computeFusedScore(features, baseCfg)).toBeLessThan(0.5);
    });

    it('temperature > 1 flattens the score toward 0.5', () => {
        const hotFeatures: FusionFeatures = {
            globalAiProb: 0.95, localTop1Mean: 0.99, localTop3Mean: 0.97,
            localTop5Mean: 0.95, localVariance: 0.005, localFracAboveHigh: 1.0,
        };
        const scoreT1 = computeFusedScore(hotFeatures, { ...baseCfg, temperature: 1.0 });
        const scoreT5 = computeFusedScore(hotFeatures, { ...baseCfg, temperature: 5.0 });
        // Higher temperature → score closer to 0.5
        expect(Math.abs(scoreT5 - 0.5)).toBeLessThan(Math.abs(scoreT1 - 0.5));
    });

    it('score is always in [0, 1]', () => {
        const f: FusionFeatures = {
            globalAiProb: 1, localTop1Mean: 1, localTop3Mean: 1,
            localTop5Mean: 1, localVariance: 1, localFracAboveHigh: 1,
        };
        const score = computeFusedScore(f, baseCfg);
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1);
    });
});
