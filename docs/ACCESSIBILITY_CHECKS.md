# Teaching navigation checks

Checked in the browser on 2026-09-26. This is a focused keyboard check, not a WCAG conformance claim or a screen-reader audit.

- Tab from page entry exposes “Skip to teaching model”; Enter focuses the model section.
- Tab from that section reaches the reading-view control; Enter opens the text teaching view.
- ArrowRight from Secretion selects Local signals; the selected tab's aria-controls points to the rendered tab panel.
- Activating “Open secretion sequence” by keyboard changes the view and moves focus to the model section.
- End on the animation slider moves to frame 180 and updates the teaching stage to Target response.
- Enter on “Show 3D” returns to the loaded model.
- Desktop layout was visually checked after adding the tab panel.
- The 3D canvas is in the tab order. Plus/minus zoom, Home resets, Shift + arrows pan, and arrow keys rotate anatomy views. Focus exposes a visible keyboard guide. Zoom and anatomy rotation/pan were checked in the browser.

Manual teaching changes use polite live announcements. Automatic animation suppresses repeated live announcements in the GLP-1 explanatory note. Reduced-motion preferences govern section scrolling; animation starts only on request.

September 27 runtime checks: injected WebGL initialization failure, model-download failure with successful retry, and real WEBGL_lose_context during playback all opened the reading view. Playback stopped and manual sequence selection remained usable. At 390 × 844 the reading fallback had no horizontal overflow. The phone layout hides the first/last-frame controls; visible sequence buttons provide manual stage navigation.

Remaining: full screen-reader testing and contrast measurements. Camera presets and region selection are available through buttons and select controls. Keyboard camera motion has been checked visually; equivalent usability with assistive technology remains untested. Local rendering observations and their limitations are in ENGINEERING_CASE_STUDY.md.

Automated follow-up: axe-core WCAG 2 A/AA and 2.1 AA checks on the 390 × 844 reading view found an invalid label on the slider container and four low-contrast text styles. The label remains on the actual slider thumb; the container label was removed. Secondary text colors were darkened. The same scan then reported zero violations. This is one view/state, not a full-site conformance or screen-reader result.
