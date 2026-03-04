# Master IDE: Roadmap & Status

## ✅ v1.6.2 — Pro Theme Editor & UI Integrity (DONE)

### Виправлено

- [x] Theme Engine: primary/secondary/success/warning/danger/info + radius/spacing
- [x] Table: rows[][] → data[] + --fg-muted light theme
- [x] Tree: 4-рівнева таксономія
- [x] Markdown: \_md2html() конвертер
- [x] Alert: нативний .content (не label)
- [x] Modal/Confirm: el.open = true
- [x] ProgressBar: tagAliases + show-label + sizes + named variants
- [x] LangSelect: string[] → {code,title}[]
- [x] Navbar i18n: data-i18n + \_translateNav()
- [x] Tree scroll: align-items: safe center
- [x] Hyphenated props: camelCase конвертація
- [x] IDE i18n: searchPlaceholder, componentCount, componentLabel, noComponentSelected

### Test Status

| Suite        | Result                  |
| :----------- | :---------------------- |
| release:spec | **97 pass, 0 fail** ✅  |
| npm test     | **109 pass, 0 fail** ✅ |
| build        | **Clean** ✅            |
| knip         | **Clean** ✅            |

---

## 🔜 v1.7.0 — Dynamic i18n & Advanced Editor (NEXT)

### Architecture (Breaking)

- [ ] **Manifest per language**: Замість одноразового build manifest — `db.fetch(URL)` для кожної мови. YAML → JSON пакування.
- [ ] **Theme Settings page**: Окрема сторінка `/theme.html` з сотнями змінних як Bootstrap `_variables.scss`.
- [ ] **UIForm for complex props**: Генерація форм для array-of-objects (LangSelect.langs, Tree.data).

### Components (ui-lit)

- [ ] **Tree keyboard**: Arrow Up/Down/Left/Right навігація (component-level, не IDE).
- [ ] **Modal footer**: Slot injection з кнопками з IDE.
- [ ] **Table column config**: UI для контролю стилів колонок (bold/muted).
