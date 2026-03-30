# @nan0web/ui — Release v1.9.0 Finalization

## Статус: 🟡 Міграція регресійних тестів (не завершена)

### ✅ Що вже зроблено
1. **OLMUI v2 стандартизація** — усі domain-моделі мають канонічний конструктор `Partial<Model> | Record<string, any>`
2. **TS2527** — виправлено у всіх `run()` через `@returns {AsyncGenerator<any, any, any>}`
3. **`pnpm build` (tsc)** — 0 помилок
4. **`release:spec`** — 132 pass, 0 fail, 2 skipped (всі релізи від v1.5.1 до v1.9.0 проходять)
5. **`ide.js` розширено**:
   - Додано Bootstrap-подібні токени: `--ui-primary`, `--ui-secondary`, etc.
   - Додано `--ui-radius-sm/md/lg/pill/circle`, `--ui-space-sm/md/lg`
   - Додано `--fg-muted` (аліас `--fg-dim`)
   - Секції «Palette» та «Geometry» у Theme Editor
   - Footer slot injection для `ui-modal` (v1.7.0 spec)
6. **ProfileDropdownModel** — тест виправлений: `p.profileName` замість `p.name`

### ❌ Що залишилось зробити

#### 1. Виправити шляхи у мігрованих тестах (~15 хв)
Файли `.spec.js` з `releases/` були переміщені у `src/test/releases/` як `.test.js`.
Але відносні шляхи (`../../../..`) зламалися через збільшення глибини вкладеності.

**Проблема:** `sed`-автозаміна задублювала `../` і зависла. Потрібно вручну виправити.

**Правильна математика:** Файл `src/test/releases/1/9/v1.9.0/task.test.js` — 6 рівнів до кореня пакету.
```
src/test/releases/1/9/v1.9.0/ → ../../../../../../ = packages/ui/
```

**Файли для ручної корекції:**

| Файл | Що виправити |
|------|-------------|
| `src/test/releases/1/9/v1.9.0/task.test.js` | ✅ `root` вже виправлений на `../../../../../../` |
| `src/test/releases/1/8/v1.8.0/task.test.js` | Відносні імпорти `../../../../../domain/` — мають бути ПРАВИЛЬНІ (5 рівнів до `src/`) |
| `src/test/releases/1/7/v1.7.0/task.test.js` | Перевірити `root` та `new URL(...)` шляхи |
| `src/test/releases/1/7/v1.7.1/task.test.js` | Перевірити `root` та імпорти |
| `src/test/releases/1/6/v1.6.2/task.test.js` | `new URL('../../../../../../docs/...')` для ide.js та YAML |
| `src/test/releases/1/6/v1.6.1/task.test.js` | `pkgDir = path.resolve(__dirname, '../../../../../../')` |
| `src/test/releases/1/6/v1.6.0/task.test.js` | Перевірити `root`, `src/` path imports |
| `src/test/releases/1/5/v1.5.2/task.test.js` | Перевірити `root` |
| `src/test/releases/1/5/v1.5.1/task.test.js` | Перевірити `root` |
| `src/test/releases/1/3/v1.3.0/task.test.js` | Перевірити |
| `src/test/releases/1/2/v1.2.0/task.test.js` | Перевірити |

**Команда для валідації одного файлу:**
```sh
node --test src/test/releases/1/9/v1.9.0/task.test.js
```

**Стратегія:** Відкрити кожен файл, перевірити шлях `root`/`pkgDir`/`new URL(...)`, виправити на `../../../../../../` (6 рівнів).

#### 2. Запустити фінальну верифікацію
```sh
pnpm test:unit    # ← повний regress suite
pnpm build        # ← tsc
pnpm release:spec # ← повинно бути 0 pass (бо .spec.js вже мігровані)
```

#### 3. Git commit (Zero-Tolerance)
```sh
git add -A
git status
# Перевірити що немає артефактів, тільки:
#   - src/test/releases/**/*.test.js (мігровані)
#   - releases/**/ (видалені .spec.js)
#   - docs/site/src/ide.js (розширені токени)
#   - src/domain/components/*.js (стандартизовані конструктори)
git commit -m "release(ui): v1.9.0 — OLMUI v2 Model-as-Schema standardization

- Standardize all domain model constructors (Partial<Model> | Record<string, any>)
- Fix TS2527 via explicit @returns on async generators
- Extend IDE theme editor with Bootstrap-compatible tokens
- Add --fg-muted, --ui-radius-*, --ui-space-* CSS variables
- Inject modal footer slot for v1.7.0 compatibility
- Migrate all release specs to src/test/releases/ regression suite
- ProfileDropdownModel: use canonical profileName field"
```

#### 4. NPM release
```sh
npm version 1.9.0
npm publish
git tag v1.9.0
git push --tags
```

### 📋 Відомі «боржники» (не блокують реліз)
- Core tests: `src/core/Form/`, `src/core/Stream.test.js` — `# TODO`
- Tree keyboard navigation: `# SKIP` (2 тести)
