# Model methodology and provenance

## Source-to-browser pipeline

1. `scripts/export_full_anatomy.py` opens `gut-hormones-blender-project/revision_02_anatomy/GI_anatomy_revision02.blend` and exports the Anatomy collection into the Draco-compressed GLB. No decimation is applied by this script; compression uses quantization.
2. `scripts/export_teaching.py` opens `gut-hormones-blender-project/revision_03_teaching/GI_Hormone_Teaching.blend`, samples animated objects at frames 1–180, and exports evaluated non-text teaching geometry plus metadata. Existing source names connect exported objects to annotations and tracks.
3. `scripts/export_web.py` supplies only the atlas export. The application reads the exported JSON files and GLBs; it does not require Blender at runtime.
4. `scripts/validate_web.py` checks structural invariants including mesh count, source-marker presence, route/target consistency, complete track lengths, and selected comparison properties. Inspect the script to understand the exact claims covered by its report.

Export scripts accept explicit `--source` and `--output` arguments and refuse to overwrite existing output files. The atlas exporter no longer creates the unused decimated anatomy. See [REBUILD.md](REBUILD.md) for the staged export commands. Re-exporting still requires the two original Blender scenes, which are not bundled in this web checkout. The committed web assets can be served independently.

## What each representation means

| Representation | Interpretation | Not established by it |
| --- | --- | --- |
| GI geometry | Educational external anatomy with compressed bowel length | Patient anatomy, internal mucosa, complete mesentery or vasculature |
| Cell markers | Qualitative regional population illustrations | Histological coordinates, measured cell counts, universal coexpression |
| Source–target route | A functional teaching connection | A traced vessel, exclusive pathway, causal intervention result |
| Traveling signal | Progress through a conceptual teaching sequence | Hormone concentration, transit time, clearance, dose response |
| Target inset | A schematic location for teaching a response | True anatomical placement or individual response magnitude |
| Oral/IV curves | Illustration of the incretin comparison | Digitized experimental observations or treatment predictions |
| Fasting overlay | Illustration of migrating motor activity | Food bolus movement or a biomechanical simulation |

The time control is a 180-frame animation timeline. A frame is not a minute after eating. Shared L-cell marker membership is a presentation convention, not proof that every represented cell expresses the same peptide combination.

## Teaching sources

The in-app source dialog covers anatomy and related physiology; stage-specific links accompany the GLP-1 reading sequence. The oral/IV reference now points to the verified Nauck and Meier paper, [The incretin effect in healthy individuals and those with type 2 diabetes](https://pubmed.ncbi.nlm.nih.gov/26876794/). It supports the conceptual comparison of insulin secretion following oral and intravenous glucose under comparable glycemia; the displayed curves were not extracted from that paper.

Additional stage references include [nutrient sensing](https://pubmed.ncbi.nlm.nih.gov/35629924/) and [GLP-1 and islet response](https://pubmed.ncbi.nlm.nih.gov/26571400/). Their inclusion is not a blanket citation for every source–target entry. A future comprehensive claim-by-claim biology audit remains separate from structural scene validation.

Asset attribution is recorded in `public/assets/photo-credit.txt` and the in-app source dialog. The intestinal photograph shows mucosa; it does not identify individual endocrine cell types. Font licensing is retained in `public/fonts`.

## Validation boundaries

Passing geometry/track checks demonstrates consistency of the browser assets with declared export requirements. It does not establish scientific validity, equivalence of every browser pixel to Blender, clinical usefulness, or learning effectiveness. Changes to biological claims require checking appropriate literature; changes to geometry and playback require engineering checks as well.
