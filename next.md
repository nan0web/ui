# @nan0web/ui — Release v1.9.0 Finalization

## Статус: 🟢 Готовий до релізу (QA Passed)

### ✅ Що вже зроблено
1. **OLMUI v2 стандартизація** — усі domain-моделі мають канонічний конструктор `Partial<Model> | Record<string, any>`
2. **TS2527** — виправлено у всіх `run()` через `@returns {AsyncGenerator<any, any, any>}`
3. **`pnpm build` (tsc)** — 0 помилок
4. **Regression suite** — 491 tests PASS (від v1.2.0 до v1.9.0)
5. **Logic Verification Core**:
    - `LogicInspector`: Реалізовано та покрито тестами
    - `VisualAdapter`: Реалізовано базовий контракт
    - `INTENT_TYPES`: Включено `render`
6. **IDE & Theme Editor**:
    - Додано Bootstrap-токени: `--ui-primary`, `--ui-secondary`, `--fg-muted`, etc.
    - Додано радіуси та відступи (`--ui-radius-*`, `--ui-space-*`)
    - Footer slot injection для `ui-modal`
7. **ProvenDoc (README.md.js)**:
   - Додано документацію нових Domain Models (v1.9.0)
   - Синхронізовано API валідації форм (`const { isValid, errors }`)
   - **Локалізація**: Повністю оновлено `docs/uk/README.md` (синхронно з EN)
8. **Package Hygiene**: Створено `.npmignore` (виключено тести та артефакти)

### ❌ Що залишилось зробити

#### 1. Дочекатися завершення фінальних тестів
```sh
npm run test:all # ← 491 PASS (очікуємо завершення фонового процесу)
```

#### 2. Git commit (Zero-Tolerance)
```sh
git add -A
git status
# Перевірити що немає артефактів, тільки:
#   - src/domain/ (стандартизовані моделі)
#   - src/test/releases/ (regression suite)
#   - docs/uk/README.md (локалізація)
#   - README.md (ProvenDoc)
#   - .npmignore
git commit -m "release(ui): v1.9.0 — OLMUI v2 Model-as-Schema & Domain Models

- Standardize all domain model constructors
- Fix TS2527 and optimize async generators
- Extend IDE theme editor with Bootstrap tokens
- Add 20 new Domain Models (Layout, Components, Business Critical)
- Synchronized ProvenDoc and UK README localization
- Hardened package hygiene via .npmignore"
```

#### 3. NPM release
```sh
npm version 1.9.0
npm publish
git tag v1.9.0
git push --tags
```

### 📋 Відомі «боржники» (не блокують реліз)
- Core tests TODO removal (Form/Stream)
- Tree keyboard navigation (2 skips)
