# Entero — release setup

Public portfolio source snapshot. The deployed teaching prototype is public. This snapshot includes the current deployed product source.

## Browser setup

Node 22.13+ and npm, from this directory:

```sh
npm ci
npx tsc --noEmit
npm run build
npm start -- --port 4188
```

In another terminal, run `node scripts/check-startup.mjs http://127.0.0.1:4188/` to verify the initial HTTP response before hydration. Open http://127.0.0.1:4188. Python 3 can optionally check committed asset structure with `python3 scripts/validate_web.py` (220 checks). Blender is unnecessary for the website. Original Blender scenes remain separate inputs; see docs/REBUILD.md for the verified staged re-export. This is not a complete scene-generation repository.

The local `.openai/hosting.json` contains null bindings only. Vite still imports it; do not remove it. No private Site ID, cloud account, sibling checkout or Codex runtime is required for browser setup. Package downloads require network access. Clean npm installation, TypeScript and production build passed on macOS ARM64 / Node 22 on September 30. The existing bundle-size warning remains; this is not a new loading benchmark.

The original app source, assets and historical rejected revision remain intact. The rejected revision is archival and not the implemented UI. Original source commit and file hashes are in release-manifest.json; the declared transformations are local hosting configuration and this README introduction.

Retain the photo, font and decoder license notices. Original-work licensing, source-scene distribution and public release is authorized. Structural checks and a successful render do not establish physiology accuracy, learner benefit or final design approval.

---

# GI hormone teaching website

This website carries the approved Blender anatomy and revision 03 teaching scene into the browser. The original .blend files are untouched.

The first view is a representative GLP-1 meal response: luminal cue, apical sensing, basolateral release, signal transport and target response. The sequence is qualitative. The tabs let learners inspect the broader anatomy, cell populations, hormone sources and targets, fasting pathways, and oral-versus-IV comparison.

## Included
- Full-resolution approved anatomy: 31 meshes, Draco-compressed for transfer; no web decimation.
- All 498 exported source markers, nine cell populations, twelve hormones and shared L-cell membership.
- All native target insets including brain, pancreas/islet symbols, liver/biliary, gallbladder, adipose, bone and vagal pathway.
- Every hormone's functional path, traveling particle and delayed target response.
- Native secretion mechanism, local signaling, fasting MMC/ghrelin and matched oral/IV comparison geometry.
- 59 native animation tracks sampled at every frame of the 180-frame Blender timeline; 24 fps, pause, scrub, first/last frame, speed and looping.
- Independent anatomy, populations, signals, targets and annotation layers.
- Front, three-quarter, side, stomach and ileocecal camera views, region isolation and model expansion.
- Full biology table, references and model limitations.

## Sources and constraints
`atlas.json` retains the authoritative biology dictionary. `teaching.json` retains native metadata and all animation samples. Fonts and labels are presented for browser readability; viewport lighting differs from Blender. Target insets, counts and timing remain qualitative.

The five phase-06 enrichment ideas remain excluded as in the Blender brief.

## Rebuild and verification
`export_full_anatomy.py` exports the approved geometry without changing the source file. `export_teaching.py` copies evaluated teaching geometry and samples all native tracks. `validate_web.py` checks object/route/track parity and writes validation/web-parity.json (220 checks).

See [portable staged export instructions](docs/REBUILD.md). The original Blender scenes remain separate inputs; browser setup uses the committed exports.

Run `npm run dev` for local preview; `npx tsc --noEmit` checks application types. Publish through Sites' normal build/hosting workflow.

The rejected site revision is preserved under revisions/rejected-02. Photography credits and licenses are in public/assets/photo-credit.txt; the handwritten font is Caveat under the SIL Open Font License (public/fonts/OFL-Caveat.txt).

## Reading view and failure recovery

The model header offers a reading view with the current GLP-1 teaching stage, source/target facts, and source links. Other modes retain their existing teaching notes. Manual sequence steps remain available. Model initialization, asset loading, or WebGL context failures open this view with a retry action. Reading view is an alternative presentation, not a replacement for spatial anatomy or the comparison curves. Smooth section navigation respects reduced-motion preferences.

Keyboard navigation checks and remaining accessibility work are recorded in [docs/ACCESSIBILITY_CHECKS.md](docs/ACCESSIBILITY_CHECKS.md).

## Engineering evidence

- [Architecture, rendering decisions, runtime checks, and limits](docs/ENGINEERING_CASE_STUDY.md)
- [Source-to-browser methodology and scientific boundaries](docs/MODEL_METHODOLOGY.md)
- Recheck exported assets with `python3 scripts/validate_web.py`. The result is structural verification, not clinical or scientific validation.
