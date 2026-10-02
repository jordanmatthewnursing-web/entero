# Re-export the teaching assets

The website runs from committed exports. Blender and the original source scenes are required only for a re-export. This checkout does not yet distribute those scenes; do not claim a complete scene-generation pipeline from a web-only clone.

## Inputs

- Blender 5.2.2 LTS with its glTF exporter and Draco support (the verified environment).
- Anatomy: `revision_02_anatomy/GI_anatomy_revision02.blend`.
- Teaching: `revision_03_teaching/GI_Hormone_Teaching.blend`.
- Python 3 for structural verification.

Run from the website root. Replace the two source paths with the locations of your original scenes. `blender` below must resolve to the Blender executable. Choose a new staging directory; existing output filenames cause an error.

```sh
blender --background --factory-startup --disable-autoexec --python-exit-code 1 --python scripts/export_full_anatomy.py -- --source /path/to/GI_anatomy_revision02.blend --output /tmp/entero-staged-assets
blender --background --factory-startup --disable-autoexec --python-exit-code 1 --python scripts/export_web.py -- --source /path/to/GI_Hormone_Teaching.blend --output /tmp/entero-staged-assets
blender --background --factory-startup --disable-autoexec --python-exit-code 1 --python scripts/export_teaching.py -- --source /path/to/GI_Hormone_Teaching.blend --output /tmp/entero-staged-assets
python3 scripts/validate_web.py --assets /tmp/entero-staged-assets --report /tmp/entero-staged-parity.json
```

Scripts open the source scenes in memory and never save them. Anatomy export preserves the full mesh without decimation; Draco compression retains the existing quantization settings. Atlas extraction no longer exports the old decimated model. Teaching export retains metadata and every frame in the 180-frame sequence.

The output is four files: anatomy-full.glb, atlas.json, teaching.glb and teaching.json. Do not copy them into public/assets until comparison passes. Structural parity is not a substitute for visual inspection when bytes differ; inspect geometry, annotations and playback before accepting changed exports. A failed export can leave partial staging files; use a new directory for the next attempt.

## September 30 verification

All four staged files were byte-identical to the committed assets in Blender 5.2.2 LTS. All 220 structural checks passed. Source-scene hashes were unchanged. This verifies re-export of the supplied scenes in that environment; it does not prove deterministic scene generation or compatibility with every Blender version. No replacement of the existing visual assets was needed.

Draco's license and decoder provenance now accompany the files in public/assets/draco/. Photo and font terms remain separate from any future original-code license. Original scene distribution, original-code licensing and public publication still require their own release decisions.

## Compiled server startup regression

After `npm run build` and `npm start -- --port 4188`, run `node scripts/check-startup.mjs http://127.0.0.1:4188/`. It requires an HTTP 200 document with teaching content and no server error shell. A hydrated page alone can conceal a failed initial response. The 3D renderer is lazy-loaded only after client-side teaching data arrives, preventing its module initialization from running at Worker startup. Then check the loaded model and reading view in a browser.
