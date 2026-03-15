# Master IDE: Roadmap & Status

## ✅ v1.7.2 — BreadcrumbModel & Sandbox Navigation (DONE, 2026-03-15)

### BreadcrumbModel — Universal Navigation Stack

Новий Model-as-Schema компонент в `@nan0web/ui/domain/components/`:

- [x] `BreadcrumbModel.js` — навігаційний стек з `push()`, `pop()`, `navigateTo()`, `canGoBack()`
- [x] Кожен елемент має `label` (display) + `path` (URL segment, auto-slugify Unicode)
- [x] Маппінг на DBFS: `toURI()` → `sandbox/button/index` (для `db.fetch()`)
- [x] Маппінг на FS: `toDataPath()` → `sandbox/button/index.yaml` (відносно `db.root`)
- [x] Маппінг на URL: `path` → `/sandbox/button`, `toURL()` → `sandbox/button`
- [x] CLI display: `toString()` → `🏖 Sandbox › Button`
- [x] `fromPath('/sandbox/button', labelMap)` — десеріалізація з URL
- [x] `slugify()` — Unicode-safe (Cyrillic, emoji strip)
- [x] `run()` async generator → yields `log` intent з `component: 'Breadcrumbs'`
- [x] **25 контрактних тестів** (construction, navigation, serialization, generator)

### SandboxModel — Breadcrumb Navigation

- [x] `SandboxModel` використовує `BreadcrumbModel` замість приватного `#stack`
- [x] ESC = `nav.pop()`, порожній стек = CancelError летить назовні → вихід
- [x] Ctrl+C = `process.exit(0)` на будь-якому рівні (prompts.js wrapper)
- [x] Breadcrumb log intent перед кожним prompt: `🏖 Sandbox › Button › Export`
- [x] Результат містить `breadcrumb: nav.path` → `/sandbox/button/export`

### CancelError & Error Handling Fixes

- [x] `GeneratorRunner.js`: `nextVal` типізовано як `IntentResponse | Error | undefined`, CancelError → `generator.throw()`
- [x] `SandboxModel.js`: catch блоки cast `e` to `Error` перед `err.name` перевіркою
- [x] `InputAdapter.js`: robust catch для `unhandled_intent` — string + ModelError об'єкт
- [x] Button CLI preview: dim ефект тільки на текст, не на border/background
- [x] Static spinner `⟲ loading...` замість анімації

### Тестування

| Suite | Result |
|:------|:-------|
| npm test (unit) | ✅ pass |
| test:ssg | ✅ pass |
| tsc build | **0 errors** ✅ |
| BreadcrumbModel | **25 pass** ✅ |
| SandboxModel | ✅ pass |

---

## ✅ v1.7.0 — OLMUI Generator Engine (DONE)

### Migration Path (UiAdapter → runGenerator)

| Стара (v1.x) | Нова (OLMUI Engine) |
|---|---|
| `UiAdapter` клас (OOP) | `runGenerator` функція (FP) |
| `adapter.ask()` / `adapter.select()` | `yield ask('field', schema)` |
| `processForm(UIForm)` | `yield ask('form', Model)` |
| `EventProcessor` наслідування | Чистий async generator |
| `CancelError` throw | `AbortSignal` / `ModelError` |

Обидві системи **співіснують**. Нова — наступна ітерація, що поступово замінить стару.

---

## ✅ v1.7.1 — Dynamic i18n & Advanced Editor (DONE)

### Зроблено

- [x] Manifest per language: `db.fetch(URL)` для кожної мови. YAML → JSON.
- [x] Theme Settings page: `/uk/CSS.html` та `/en/CSS.html` deep linking.
- [x] UIForm for complex props: array-of-objects (object→JSON textarea, boolean→text).
- [x] Smart inputs: rgba→color+opacity slider, rem/px→number+unit select.
- [x] Live Preview: у правому sidebar замість знизу.
- [x] Sidebar navigation: absolute URLs з locale prefix.
- [x] CSS.html route: `_syncFromUrl()` + `generate-pages.js` генерує файли.

---

## ✅ v1.7.1 — Theme Editor: CSS Variable Propagation (DONE)

### Проблема

**CSS Variables не впливали на компоненти** — головний баг Theme Editor.

### Кореневі причини (Root Cause Analysis)

1. **Shadow CSS `:host` override**: `--co: var(--ide-accent)` у shadow CSS `master-ide`
   створював scope boundary, який блокував inherited `--co` від inline styles.
2. **`--ui-btn-bg` override**: Fallback chain у `ui-button` — `var(--ui-btn-bg, var(--co, #818cf8))`.
   Коли `--ui-btn-bg: '#0099dc'` було задано, воно перебивало `--co`.
3. **Empty string = valid CSS value**: Порожні CSS custom properties (`--ui-btn-bg: ""`)
   через inline style вважаються валідними і не дають fallback спрацювати.

### Виправлення

1. ✅ Видалено `--co: var(--ide-accent)` з `:host` shadow CSS — тепер `--co` каскадується нормально
2. ✅ `--ui-btn-bg` / `--ui-btn-fg` default → `''` — наслідують `--co` / `--co-on` tokens
3. ✅ `_applyCssVars()` — `removeProperty()` для порожніх значень (замість `setProperty('')`)
4. ✅ Inline cssVars style на wrapper div у `_renderThemePreview()` та `.preview-canvas`
5. ✅ Фільтрація порожніх значень при побудові inline style string

### E2E тести

| Тест                                 | Статус  |
| :----------------------------------- | :------ |
| `color input dispatches @input`      | ✅ pass |
| `/uk/CSS.html loads Theme Editor`    | ✅ pass |
| `CSS vars set on host after load`    | ✅ pass |
| `--co change → Primary button color` | ✅ pass |

### Файли змінені

- `docs/site/src/ide.js` — shadow CSS fix, cssVars defaults, \_applyCssVars, \_renderThemePreview
- `e2e/theme-editor.spec.js` — оновлено selector `.theme-preview-wrap`
- `e2e/debug-theme.spec.js` — оновлено selector

---

## 🔜 v1.8.0 — Theme Editor Pro & Sidebar Components (NEXT)

### Theme Editor

- [ ] Shadow editor: visual box-shadow builder
- [ ] CSS Export: кнопка «Export CSS» для копіювання `:root { ... }`
- [ ] CSS Import: paste готового CSS
- [ ] Reset to defaults
- [ ] Persistence: зберігати в localStorage

### Sidebar Base Components

- [ ] ColorPicker: окремий sidebar component
- [ ] ColorRGBA: color + opacity slider
- [ ] SizeUnit: number + unit select

### Components (ui-lit)

- [ ] Tree keyboard: Arrow keys навігація
- [ ] Modal footer: Slot injection
- [ ] Table column config
- [ ] Focus ring: `--ui-*-focus` змінні

### Unit Test Status

| Suite        | Result                  |
| :----------- | :---------------------- |
| npm test     | **129 pass, 0 fail** ✅ |
| test:docs    | **17 pass, 0 fail** ✅  |
| test:play    | **1 pass, 0 fail** ✅   |
| tsc build    | **0 errors** ✅         |
