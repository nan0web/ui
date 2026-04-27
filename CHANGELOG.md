# Changelog

## [1.12.1]

### Fixed
- **Typescript Typings:** Refined and fixed `JSDoc` types in `CoreApp`, `Widget`, and `View` to prevent implicit `any` and incompatibility errors downstream.

### Added
- **Workflow Sync:** Added global Agents Workflows into the package for AI consistency.

## [1.12.0]

### Added

- **Model-as-App (v2.1):** Enhanced `ModelAsApp` base class with built-in interpolation. Re-architected Intent generators (`ask`, `progress`, `show`, `render`, `result`) as strict typed standard functions.
- **Deterministic Scenario Testing:** Introduced `ScenarioAdapter` and `ScenarioTest` in `test/` for lightning-fast, zero-I/O edge-case test verification of complex domain interactions.
- **Full OLMUI HTML5 Typings:** Expanded `HTML5Elements` JSDoc dictionary in `Content.js` to include exhaustive support for standard HTML5 and base SVG elements with zero runtime cost.
- **Model-as-Schema Casing Standard:** Officially documented `camelCase` as the single canonical standard for all multi-word tags (`featureGrid`, `profileDropdown`) in `.nan0` data payloads (translated into HTML kebab-case strictly by View Adapters like `@nan0web/ui-lit`).

### Fixed

- **Typescript Circularity:** Resolved `TS2502` circular dependency crash by preventing type intersection overlap (`button`, `input`, `select`) in `CoreUIElements` and `HTML5Elements`.

### Removed

- **Legacy E2E Suite:** Purged `playwright.config.js`, `test/e2e` suite, and `ssg.test.js`. DOM testing is explicitly removed from the raw `@nan0web/ui` base package to strictly enforce the pure Domain Logic (OLMUI Model-as-Schema) boundary. Visual tests belong exclusively to View Adapters.
