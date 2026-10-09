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

## Complete a meal-response lesson

Follow the five GLP-1 stages, use “Check your understanding” to answer three questions, revisit the linked stage for an explanation, and save a plain-text study recap. The recap contains all five teaching notes, current answers, teaching answers and source URLs. Changing an answer invalidates earlier feedback; restarting clears the exercise. Answers stay only in page memory and are lost on reload unless downloaded. This is practice, not certification or a validated comprehension measure. Existing animation/model semantics are unchanged.

October 3 verification: typecheck and production build passed. Browser exercised incorrect/correct answers, stale-feedback clearing, stage-4 navigation (GLP-1 frame 100), restart, reading view and focus return to the exercise. Actual recap download was inspected. 390px layout had no horizontal overflow; no physical phone, screen-reader or learner outcome claim. Lesson content reuses the existing five-stage teaching text; nutrient-sensing source title/abstract checked at https://pubmed.ncbi.nlm.nih.gov/35629924/. Other retained sources are not represented as newly revalidated.
