# Master IDE: Roadmap & Status

## Next Release: v1.6.0 — Architecture UI Map & Full Docs

**Objective**: Build a global component readiness map and shift from "Sandbox" to "Complete Documentation" standard.

### Tasks:

- [ ] **Architecture UI Map**:
  - Implement a registry table that checks component exports across multiple implementations (Lit, React, CLI).
  - Automate "Ready/Not Ready" status generation.
- [ ] **Full Docs Standard**:
  - Render `README.md` and `project.md` directly in the IDE.
  - Integrate i18n into documentation pages.
- [ ] **Universal Interface Template**:
  - Create a lightweight template for fast expansion to new interfaces.
  - Document the inheritance pattern.

---

## Finished: v1.5.2 — Code Formats, i18n & UX Polish

- [x] **NaN0 Spec Format**: Implemented bare values and `$`-prefixed attributes.
- [x] **Content Fix**: `label` → `content` across all YAMLs (both `uk/` and `en/`), except TreeNode.
- [x] **i18n UI**: Full Ukrainian/English interface (Preview, Properties, Reset, Copy code, Add variation).
- [x] **Tab Styling**: Replaced pills with flush tabs (`border-radius: 0`, `gap: 0`) in variations and code pane.
- [x] **Mobile UX**: Sidebar toggle → sticky bottom-right (glassmorphism, `backdrop-filter: blur`). Add variation → `+` only on mobile.
- [x] **Sidebar box-shadow**: Removed when closed, shown only on `.open`.
- [x] **Persistence**: `codeFormat` saved to `localStorage`.
- [x] **ProvenDoc**: Updated `README.md.js` with Master IDE & NaN0 Spec sections.
- [x] **i18n README**: Ukrainian translation at `docs/uk/README.md` with cross-language links.
- [x] **.gitignore**: Added Playwright snapshots (`*-snapshots/`, `test-results/`, `playwright-report/`).
