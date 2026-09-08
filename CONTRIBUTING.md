# Contributing to UnDiffused

Thanks for taking the time to improve the project. Contributions are welcome
across the browser extension, model pipeline, evaluation, security and
documentation.

The main standard is simple: a change should be easy to inspect and its claims
should be no broader than its evidence.

## Before you start

Open an issue before investing in a large model, architecture, permission or
dataset change. Small fixes and documentation corrections can go directly to a
pull request.

Security vulnerabilities should not be filed publicly. Follow
[`SECURITY.md`](SECURITY.md) instead.

## Development setup

```bash
git clone https://github.com/AkshayReddyGujjula/UnDiffused-AI.git
cd UnDiffused-AI
git lfs install
git lfs pull
npm ci
npm run build
```

Load `dist/` from `chrome://extensions` with Developer mode enabled.

For Python training and evaluation work, create an isolated environment and see
[`docs/REPRODUCIBILITY.md`](docs/REPRODUCIBILITY.md).

## Make a focused change

1. Create a branch from the latest `main`.
2. Keep unrelated formatting and generated output out of the diff.
3. Add or update tests for changed behaviour.
4. Update the architecture, model card or decision log when their facts change.
5. Run the appropriate verification commands.
6. Explain manual checks honestly in the pull request.

## Required checks

For TypeScript, UI, runtime or documentation changes:

```bash
npm test
npm run build
npm run verify:repo
npm audit --audit-level=low
git lfs fsck
```

For Python changes:

```bash
python -m compileall -q scripts
```

Run the relevant benchmark or smoke test when behaviour changes. A successful
build is not evidence that a detector improved.

## Evidence rules for model changes

A proposed shipping model must follow
[`docs/benchmark/PROTOCOL_V2.md`](docs/benchmark/PROTOCOL_V2.md).

At minimum:

- evaluate the exact ONNX file that the extension will load;
- keep pair IDs together across every split;
- do not train, select or tune thresholds on the external 400-pair set;
- report the full laundering suite and a 95% interval for primary AUROC;
- report external calibration and abstention behaviour;
- verify the browser WASM runtime and real TypeScript contract;
- preserve machine-readable result files;
- update limitations and generator coverage beside the headline number.

Do not replace a measured but imperfect result with an attractive number from a
different graph, fitting set or confounded corpus.

## Privacy and permissions

Any change that adds a network request, browser permission, persistent store,
analytics event or external service must document:

- what data leaves the device;
- when the action occurs;
- whether it is user-triggered;
- which permissions it needs;
- how untrusted URLs and responses are bounded;
- how the public privacy wording must change.

Local inference does not mean a feature has no network behaviour. Remote source
retrieval and optional external search are documented separately for this
reason.

## Code and writing style

- Prefer clear names and small functions over clever abstractions.
- Explain why a security or model guard exists, not only what it does.
- Use UK spelling in documentation, comments and visible interface copy.
- Standard API and language identifiers such as CSS `color` remain unchanged.
- Do not use Unicode dash or minus characters. Rewrite the sentence or use an
  ASCII hyphen where technically necessary.
- Keep claims direct and student-readable. Avoid promotional filler.
- Link to machine-readable evidence instead of duplicating long result tables.
- Use `artefact`, `normalisation`, `optimisation`, `visualisation` and `licence`
  in prose.

`npm run verify:repo` enforces the Unicode and local-link rules.

## Generated and large files

- Do not commit `dist/`, local datasets, checkpoints, logs or benchmark caches.
- Track shipping ONNX and WASM files through Git LFS.
- Keep third-party image bytes out of Git.
- Update manifests and SHA-256 values when dataset identity changes.
- Do not use a broad staging command without reviewing untracked files first.

## Documentation ownership

| If you change | Also review |
|---|---|
| Extension boundaries or data flow | `docs/ARCHITECTURE.md`, `SECURITY.md` |
| Model, preprocessing or tensor shape | `docs/MODEL_CARD.md`, `contract.ts`, metadata |
| Dataset or metric | `PROTOCOL_V2.md`, result JSON, README limits |
| Calibration or thresholds | calibration JSON, contract tests, model card |
| Browser permission or external action | README privacy section, architecture and security policy |
| Public milestone | `CHANGELOG.md`, engineering journey when substantial |

## Pull request quality

A strong pull request answers four questions:

1. What changed?
2. Why was it needed?
3. What evidence shows it works?
4. What was not tested or remains limited?

Screenshots are helpful for interface changes. Include the actual browser state,
not a recreated mock-up.
