# Seed: CORE-8 — UI Domain Models → extends Model (@nan0web/core)

> Пакет: `@nan0web/ui` (v1.7.0) · 11 компонентних моделей + SandboxModel
> Пріоритет: 🥉 №3 (найбільший обсяг, потребує перевірки на циклічні залежності)

## 1. Поточний стан

Всі 12 моделей у `src/domain/` використовують один і той самий паттерн:

```js
import { resolveDefaults } from '@nan0web/types'

export class InputModel {
  static placeholder = { help: '...', default: '', type: 'string' }
  // ...ще static fields...

  placeholder = InputModel.placeholder.default  // ← ES field initializer (gotcha!)
  // ...ще instance fields...

  constructor(data = {}) {
    Object.assign(this, resolveDefaults(InputModel, data))
  }
}
```

### Список моделей для міграції

| # | Модель | Файл | Instance fields | Static fields |
|:--|:-------|:-----|:----------------|:--------------|
| 1 | InputModel | `components/InputModel.js` | ~12 | ~12 |
| 2 | SelectModel | `components/SelectModel.js` | ~5 | ~5 |
| 3 | TreeModel | `components/TreeModel.js` | ~4 | ~4 |
| 4 | TableModel | `components/TableModel.js` | ~5 | ~5 |
| 5 | ButtonModel | `components/ButtonModel.js` | ~8 | ~8 |
| 6 | SpinnerModel | `components/SpinnerModel.js` | ~4 | ~4 |
| 7 | ToastModel | `components/ToastModel.js` | ~6 | ~6 |
| 8 | ConfirmModel | `components/ConfirmModel.js` | ~5 | ~5 |
| 9 | AutocompleteModel | `components/AutocompleteModel.js` | ~4 | ~4 |
| 10 | BreadcrumbModel | `components/BreadcrumbModel.js` | ~6 | ~6 |
| 11 | SandboxModel | `SandboxModel.js` | ~6 | ~6 |
| 12 | ShowcaseAppModel | `ShowcaseAppModel.js` | ? | ? |

## 2. Цільовий стан

```js
import { Model } from '@nan0web/core'

export class InputModel extends Model {
  static placeholder = { help: 'Placeholder text', default: '', type: 'string' }
  static value = { help: 'Current value', default: '', type: 'string' }
  // ...static fields залишаються без змін...
  // ❌ instance field initializers ВИДАЛЯЮТЬСЯ
  // ❌ constructor з resolveDefaults ВИДАЛЯЄТЬСЯ
}
```

## 3. Контрольний список

### Перед міграцією
- [ ] Перевірити відсутність циклічних залежностей: `@nan0web/ui` → `@nan0web/core`
  - `core` dependencies: `@nan0web/db`, `@nan0web/i18n`, `@nan0web/protocol`, `@nan0web/types`
  - `ui` dependencies: `@nan0web/co`, `@nan0web/event`, `@nan0web/log`, `@nan0web/types`
  - ✅ **Безпечно** — жодного циклу
- [ ] Додати `@nan0web/core` до `dependencies` у `package.json`

### Міграція (по одній моделі, кожна — окремий commit)
Для кожної моделі:
- [ ] Замінити `import { resolveDefaults } from '@nan0web/types'` → `import { Model } from '@nan0web/core'`
- [ ] Додати `extends Model`
- [ ] Видалити всі instance field initializers (наприклад, `placeholder = InputModel.placeholder.default`)
- [ ] Видалити або спростити constructor до `super(data)` (або прибрати повністю)
- [ ] Прогнати тести цієї моделі
- [ ] Перевірити що `static UI` блок залишився на місці

### Після міграції
- [ ] Прогнати `npm run test:all` (129 unit + 17 docs + 1 play + e2e)
- [ ] `npm run build` (tsc) — 0 errors
- [ ] `npm run knip` — перевірити що `@nan0web/types` не стало зайвим

## 4. Моделі з кастомним constructor (потребують уваги)

Деякі моделі мають логіку у constructor крім `resolveDefaults`:

- **BreadcrumbModel** — може мати `push()` / navigation logic у constructor
- **SandboxModel** — використовує BreadcrumbModel
- **InputModel** — може мати type coercion

Для цих моделей constructor стає:
```js
constructor(data = {}) {
  super(data)
  // ...кастомна логіка після super()...
}
```

## 5. Ризик циклічності: ✅ Безпечно

Граф залежностей:
```
core → db, i18n, protocol, types
ui   → co, event, log, types, string-width
```
Додавання `ui → core` не створює циклу, оскільки `core` не залежить від `ui`.

## 6. Очікуваний результат

- 12 моделей з `extends Model`
- ~70 instance field initializers видалено
- ~12 ручних `resolveDefaults` видалено
- Єдина точка розширення: коли Model отримає `.validate()` (CORE-10), всі 12 моделей отримають його автоматично
