# UnDiffused V2 Release Checklist

All items must be checked before merging V2 to main.

## Inference Correctness
- [ ] Model metadata files (`model_global_meta.json`, `model_local_meta.json`) validated at startup (no console errors)
- [ ] Class mapping verified on ≥5 labeled sanity samples (known AI and known real images)
- [ ] No hardcoded class-index assumptions remain in `worker.ts`
- [ ] Runtime session validator (`validateSession`) passes on both models

## Model + Fusion
- [ ] `fusion_v2.json` coefficients trained on labeled dataset (not default approximations)
- [ ] Fusion calibration temperature set from validation set
- [ ] Decision threshold selected by F1 objective and documented in benchmark report
- [ ] `fusion_v2.json` version field updated to match release

## Performance
- [ ] Normal scan p90 ≤ 6s on reference hardware (MacBook M2 / equivalent)
- [ ] Deep scan p90 ≤ 40s on a 1080p image on reference hardware
- [ ] Cold-start model load ≤ 4s

## Memory
- [ ] Peak RAM during deep scan < 1.5 GB (measured with Chrome Task Manager)
- [ ] Steady-state memory after scan completion < 500 MB

## Accuracy
- [ ] AUROC > 0.90 on in-domain test partition
- [ ] F1 > 0.85 at release threshold
- [ ] ECE < 0.05 (calibration)
- [ ] Benchmark report (`benchmarks/v2_candidate.json`) committed to repo
- [ ] Comparison with baseline (`benchmarks/v2_baseline.json`) shows no regression

## Tests & Build
- [ ] `npm run test` — all 34+ unit tests pass
- [ ] `npm run build` — TypeScript compilation succeeds, no errors
- [ ] No console errors on extension startup in Chrome

## UX
- [ ] No regressions in normal scan flow (scan → result → deep scan → tools)
- [ ] Uncertainty state displayed correctly in UI for borderline images
- [ ] Progress bar works correctly for deep scan

## Documentation
- [ ] `README.md` updated with V2 architecture description
- [ ] `docs/benchmark_protocol.md` reviewed and current
- [ ] `CLAUDE.md` or inline comments updated if inference pipeline changed significantly

## Release Artifacts
- [ ] `public/models/model_global_quantized.onnx` — V2 model
- [ ] `public/models/model_local_quantized.onnx` — V2 model
- [ ] `public/models/model_global_meta.json` — correct class mapping
- [ ] `public/models/model_local_meta.json` — correct class mapping
- [ ] `public/models/fusion_v2.json` — trained coefficients
