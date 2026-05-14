import { describe, it, expect, vi } from 'vitest';

// Mock onnxruntime-web so modelMeta.ts can be imported in Node
vi.mock('onnxruntime-web', () => ({
    default: {},
    InferenceSession: { create: vi.fn() },
    Tensor: vi.fn(),
    env: { wasm: {} },
}));

import { extractAiProbability, validateSession, ModelMeta } from '../modelMeta';

const makeMeta = (overrides: Partial<ModelMeta> = {}): ModelMeta => ({
    input_name: 'input',
    output_name: 'output',
    num_classes: 2,
    ai_class_index: 1,
    output_format: 'softmax',
    normalization: { mean: [0.485, 0.456, 0.406], std: [0.229, 0.224, 0.225] },
    input_size: 224,
    ...overrides,
});

describe('extractAiProbability', () => {
    it('2-class softmax: returns AI prob at index 1', () => {
        // logits [0.0, 2.0] → softmax ≈ [0.12, 0.88]
        const data = new Float32Array([0.0, 2.0]);
        const meta = makeMeta({ num_classes: 2, ai_class_index: 1, output_format: 'softmax' });
        const prob = extractAiProbability(data, 0, meta);
        expect(prob).toBeGreaterThan(0.8);
        expect(prob).toBeLessThan(1.0);
    });

    it('2-class softmax: returns REAL prob when AI class is index 0', () => {
        // Same logits but AI is at index 0 — should return prob for index 0
        const data = new Float32Array([2.0, 0.0]);
        const meta = makeMeta({ num_classes: 2, ai_class_index: 0, output_format: 'softmax' });
        const prob = extractAiProbability(data, 0, meta);
        expect(prob).toBeGreaterThan(0.8);
    });

    it('3-class softmax: uses ai_class_index correctly', () => {
        // logits [0, 3, 0] → softmax puts most mass on class 1
        const data = new Float32Array([0.0, 3.0, 0.0]);
        const meta = makeMeta({ num_classes: 3, ai_class_index: 1, output_format: 'softmax' });
        const prob = extractAiProbability(data, 0, meta);
        expect(prob).toBeGreaterThan(0.85);
    });

    it('3-class softmax: handles batch correctly (picks right slice)', () => {
        // Batch of 2: item 0 has logits [0,0,0], item 1 has logits [0,4,0]
        const data = new Float32Array([0.0, 0.0, 0.0, 0.0, 4.0, 0.0]);
        const meta = makeMeta({ num_classes: 3, ai_class_index: 1, output_format: 'softmax' });

        const prob0 = extractAiProbability(data, 0, meta); // uniform → ~0.33
        const prob1 = extractAiProbability(data, 1, meta); // strong AI → high

        expect(prob0).toBeCloseTo(0.333, 1);
        expect(prob1).toBeGreaterThan(0.9);
    });

    it('binary logit: applies sigmoid', () => {
        // logit = 0 → sigmoid = 0.5
        const data = new Float32Array([0.0]);
        const meta = makeMeta({ num_classes: 1, ai_class_index: 0, output_format: 'binary_logit' });
        const prob = extractAiProbability(data, 0, meta);
        expect(prob).toBeCloseTo(0.5, 5);
    });

    it('binary logit: large positive logit gives prob close to 1', () => {
        const data = new Float32Array([10.0]);
        const meta = makeMeta({ num_classes: 1, ai_class_index: 0, output_format: 'binary_logit' });
        const prob = extractAiProbability(data, 0, meta);
        expect(prob).toBeGreaterThan(0.999);
    });
});

describe('validateSession', () => {
    it('passes when names match metadata', () => {
        const mockSession = { inputNames: ['input'], outputNames: ['output'] } as any;
        const meta = makeMeta({ input_name: 'input', output_name: 'output' });
        expect(() => validateSession(mockSession, meta, 'TestModel')).not.toThrow();
    });

    it('throws when input name mismatches', () => {
        const mockSession = { inputNames: ['x'], outputNames: ['output'] } as any;
        const meta = makeMeta({ input_name: 'input', output_name: 'output' });
        expect(() => validateSession(mockSession, meta, 'TestModel')).toThrow(/input name mismatch/);
    });

    it('throws when output name mismatches', () => {
        const mockSession = { inputNames: ['input'], outputNames: ['y'] } as any;
        const meta = makeMeta({ input_name: 'input', output_name: 'output' });
        expect(() => validateSession(mockSession, meta, 'TestModel')).toThrow(/output name mismatch/);
    });
});
