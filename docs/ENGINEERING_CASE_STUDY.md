# Entero — bringing a physiology teaching scene to the browser

## Purpose and scope

Entero lets a learner follow a representative GLP-1 response after a meal, then explore related anatomy, cell populations, source–target relationships, local signaling, fasting activity, and the incretin comparison. Jordan's BSN/RN background informed the educational direction. The application was developed with Codex; authorship claims should describe actual design, implementation, and verification work without inventing independent clinical validation.

The project demonstrates interactive 3D engineering and the judgment required to present a simplified scientific model. It is an educational visualization. It does not predict concentrations, disease, medication response, or individual outcomes.

## Architecture

The React/TypeScript page owns the selected teaching mode, hormone, anatomical region, camera preset, layer visibility, and timeline. Radix-based interface primitives provide tabs, selectors, switches, dialogs, and the slider. AnatomyViewer owns a Three.js scene, orthographic camera, lights, picking, and OrbitControls.

Data is separated from the interface:

- `atlas.json`: 12 hormone/signaling entries, 498 illustrative markers, 22 paths, and 12 target coordinates.
- `teaching.json`: 290 object metadata entries, 97 text entries, eight exported cameras, and 59 tracks sampled across 180 frames at 24 fps.
- `anatomy-full.glb`: 31 anatomy meshes with Draco compression.
- `teaching.glb`: exported teaching geometry with source-name metadata used to connect objects and tracks.

These are curated scene assets rather than patient measurements. Metadata counts are inventory facts, not evidence of biological accuracy.

The export scripts open the existing Blender files, export geometry and metadata, and do not save over the source scenes. Scripts currently contain local source paths, documented in MODEL_METHODOLOGY.md. Running the web application needs only the checked-in exports; rebuilding the Blender exports additionally requires the original source files and Blender.

## Rendering decisions

An orthographic camera supports legible schematic views. Camera framing changes with the teaching mode and viewport aspect ratio. Hormone selection controls marker, route, signal, and target visibility. Selecting a region adjusts the opacity of other anatomy. The browser recreates selected labels as sprites with a minimum screen-space size, rather than displaying every source annotation at once.

Timeline state is shared between the slider, discrete teaching steps, animation controls, and explanatory text. The viewer interpolates sampled positions and scales. It does not run a physiological solver. The current renderer does not apply quaternion animation samples; future rotation-dependent teaching tracks would need explicit implementation and verification.

The scene retains full anatomy topology. Draco compression reduces geometry transfer, but this is not a claim of bit-identical coordinates: quantization is configured in the export script. Lighting, materials, labels, and framing intentionally differ from a Blender render.

## Failure handling and access

The reading view presents the current teaching stage, source and target information, and references. It is available on request and opens automatically if WebGL cannot initialize, a scene asset fails to load, or a live graphics context is lost. Playback stops while manual steps remain usable. Retry creates a new scene.

Scene cleanup cancels the render loop, disconnects resizing, disposes controls/decoder resources and scene geometry/materials, and removes canvas listeners. Assets that finish loading after unmount are disposed instead of attached to an abandoned scene.

Keyboard support includes a skip link, tab navigation, manual stage controls, camera zoom/reset, and rotation/pan in supported views. Text announcements are suppressed during automatic playback to avoid announcing each animation update. Reading view supplies prose access to teaching content; it does not reproduce all spatial relationships or comparison curves.

## Evidence gathered September 27, 2026

- Four runtime scenarios passed: denied WebGL initialization; failed model download and successful retry; context loss during playback; phone-width reading fallback without horizontal overflow.
- Asset/track validation was rerun: see `validation/web-parity.json` and `scripts/validate_web.py`. Its checks inspect structural consistency; they do not independently validate anatomy or physiology.
- Local headless Chrome playback samples at 1440 × 1000 and 390 × 844 showed approximately 16.7 ms median animation-frame intervals over 2.5 seconds. Ready state occurred around 408–410 ms in these particular local runs.
- These timings are development-server observations on a desktop machine, without network or CPU throttling. They are not production load times, physical-phone measurements, field Core Web Vitals, or an FPS guarantee.

Detailed machine-readable observations and the reproducible runtime harness are in the adjacent `portfolio-program/qa` folder. The harness uses isolated browser contexts and does not alter hosted state.

## Remaining work and honest limits

Full screen-reader use and measured contrast remain to be checked. A physical mobile-device/network performance pass and learner task testing have not occurred. The downloaded asset set includes substantial photographs and geometry; local responsiveness does not establish acceptable transfer time on a slow connection. There are no measured learning gains or provider endorsements.

Future work should be driven by a specific learner task and measured bottleneck. The proposed single-cell evidence layer is a separate future extension, not a feature of the present site.
