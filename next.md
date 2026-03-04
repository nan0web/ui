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

## Finished: v1.5.2 — Code Formats & UX Polish

- [x] **NaN0 Spec Format**: Implemented bare values and `$`-prefixed attributes.
- [x] **Content Fix**: Removed `label` from all YAMLs (except TreeNode) and mapped `content` in IDE.
- [x] **i18n UI**: Full Ukrainian/English interface support (Preview, Properties, Reset, etc.).
- [x] **Tab Styling**: Replaced pills with flush tabs in variations and code pane.
- [x] **Mobile UX**: Repositioned sidebar toggle to bottom-right (glassmorphism) and optimized tabs.
- [x] **Persistence**: `codeFormat` saved to `localStorage`.
