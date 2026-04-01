# @nan0web/ui

🏴󠁧󠁢󠁥󠁮󠁧󠁿 [English](../../README.md) | 🇺🇦 [Українською](./README.md)

<!-- %PACKAGE_STATUS% -->

Легкий, агностичний UI-фреймворк, побудований за **філософією nan0web**
— одна логіка застосунку, багато UI-реалізацій.

Ця бібліотека надає базові класи та утиліти для побудови структурованих інтерфейсів.
Підтримує:

- Обмін повідомленнями (Input/Output)
- Форми з валідацією
- Відстеження прогресу
- Рендеринг компонентів
- Керування виглядом через Frame-рендеринг
- Структуру застосунку з основними та користувацькими додатками

Працює як у синхронному, так і в асинхронному режимі — у термінальних та веб-застосунках,
з акцентом на типобезпеку, мінімалізм та чистий JavaScript-дизайн.

## Встановлення

Як встановити через npm?

```bash
npm install @nan0web/ui
```

Як встановити через pnpm?

```bash
pnpm add @nan0web/ui
```

Як встановити через yarn?

```bash
yarn add @nan0web/ui
```

## Концепції та архітектура

### Потік повідомлень

UI-комунікація побудована навколо повідомлень:

- **`UiMessage`** – абстрактний базовий клас повідомлень
- **`OutputMessage`** – системний вивід (контент, помилка, пріоритет)

Повідомлення — це прості, серіалізовані контейнери даних. Вони допомагають будувати
розʼєднані системи комунікації між UI-компонентами.

Як створити вхідні та вихідні повідомлення?

```js
import { InputMessage, OutputMessage } from '@nan0web/ui'
const input = UiMessage.from({ body: 'Hello User' })
const output = OutputMessage.from({ content: ['Welcome to @nan0web/ui'] })
console.info(input) // ← Message { body: "Hello User", head: {}, id: "....", type: "" }
console.info(String(output)) // ← Welcome to @nan0web/ui
```

### Форми

`UiForm` підтримує визначення полів, керування даними та валідацію за схемою.
Кожна форма містить заголовок, поля та поточний стан.

Типи полів:

- `text`
- `email`
- `number`
- `select`
- `checkbox`
- `textarea`

Як визначити та валідувати UiForm?

```js
import { UiForm } from '@nan0web/ui'
const form = new UiForm({
  title: 'Contact Form',
  fields: [
    FormInput.from({ name: 'email', label: 'Email Address', type: 'email', required: true }),
    FormInput.from({
      name: 'message',
      label: 'Your Message',
      type: 'textarea',
      required: true,
    }),
  ],
	state: {
		email: 'invalid-email',
		message: 'Hello!',
	},
})
const { isValid, errors } = form.validate()
console.info(Object.keys(errors).length) // ← 1
console.info(errors.email) // ← Invalid email format
```

### Компоненти

Компоненти рендерять дані як готовий до фрейму вивід.

- `Welcome` – вітає користувача на імʼя
- `Process` – показує прогрес-бар та час

Як відрендерити компонент Welcome?

```js
import { Welcome } from '@nan0web/ui'
const frame = Welcome({ user: { name: 'Alice' } })
const firstLine = frame[0].join('')
console.info(firstLine) // ← Welcome Alice!
```

### Менеджер вигляду

`View` поєднує компоненти та рендерить фрейми.

Кожен вигляд має:

- Locale – форматований текст, числа, валюта
- StdIn / StdOut – потоки вводу/виводу
- Frame – буфер виводу з візуальними властивостями

Як відрендерити фрейм за допомогою View?

```js
import { View } from '@nan0web/ui'
const view = new View()
view.render(1)(['Hello, world'])
console.info(String(view.frame)) // ← "\rHello, world"
```

### Рендеринг фреймів

`Frame` керує візуальним рендерингом з обмеженнями ширини та висоти.
Корисний для терміналів фіксованого розміру або UI-блоків.

Методи рендерингу:

- `APPEND` – додає контент після попереднього фрейму
- `REPLACE` – стирає та замінює всю область фрейму
- `VISIBLE` – рендерить лише видиму частину фрейму

Як створити Frame з фіксованим розміром?

```js
import { Frame } from '@nan0web/ui'
const frame = new Frame({
  value: [['Frame content']],
  width: 20,
  height: 5,
  renderMethod: Frame.RenderMethod.APPEND,
})
const rendered = frame.render()
console.info(rendered.includes('Frame content')) // ← true
```

### Моделі

UI-моделі — це прості обʼєкти даних, керовані класами `Model`.

- `User` – дані користувача

Як використовувати модель User?

```js
import { Model } from '@nan0web/ui'
const user = new Model.User({ name: 'Charlie', email: 'charlie@example.com' })
console.info(user.name) // ← Charlie
console.info(user.email) // ← charlie@example.com
```

### Тестування UI

Ядро покрите юніт-тестами для стабільності в різних середовищах.

Усі компоненти, адаптери та моделі розроблені для зручного тестування
з мінімальним налаштуванням.

Як тестувати UI-компоненти з асертами?

```js
import { Welcome } from '@nan0web/ui'
const output = Welcome({ user: { name: 'Test' } })
console.info(output) // ← Welcome Test!
```

### Master IDE (Пісочниця компонентів)

Master IDE (OlmuiInspector) надає уніфіковане середовище для тестування та документування
веб-компонентів на різних платформах. Підтримує:

- **NaN0 Spec** — лаконічний YAML-формат для оголошення варіацій компонентів.
- **OlmuiInspector** — уніфікований UI для дослідження моделей та властивостей компонентів.
- **Живий перегляд** — рендеринг станів компонентів у реальному часі.
- **i18n UI** — повністю локалізований інтерфейс (UK/EN) для розробників.
- **Редактор тем** — система CSS-змінних рівня Bootstrap з живим попереднім переглядом.

Побудований за патерном **Olmui**: _Одна логіка — багато UI_ (один маніфест працює і у CLI, і у Web).

#### Редактор тем (CSS-змінні)

Професійна система налаштування тем з живим переглядом. Підтримує:

- **Палітра**: primary, secondary, success, warning, danger, info
- **Геометрія**: border-radius (sm/md/lg/pill/circle), spacing (sm/md/lg)
- **Типобезпечні поля**: `type="color"` для кольорів, числові поля для розмірів

#### Архітектура рендерингу компонентів

IDE виконує трансформацію даних між YAML-моделями та веб-компонентами:

- **Table**: `rows[][] + columns[]` → `data[]` (масив обʼєктів)
- **Tree**: `data` → `items` маппінг з 4-рівневою таксономією
- **Markdown**: Сирий markdown → HTML через конвертер `_md2html()`
- **ProgressBar**: Аліас тегу (`ui-progress-bar` → `ui-progress`), кольорові варіанти
- **LangSelect**: `string[]` → `{code,title}[]` конвертація
- **Hyphenated props**: Автоматична `camelCase` конвертація (`show-label` → `showLabel`)

#### NaN0 Spec (YAML)

Лаконічний формат для визначення варіацій:

Як визначити варіацію компонента за допомогою NaN0 Spec?

```yaml
- Button: Primary
  $variant: brand
  $outline: true
```

#### Сайт документації

IDE включає автогенерований сайт документації.
HTML-сторінки генеруються з шаблону `ide.html` через `generate-pages.js`:

- Сторінки для кожної мови (`/uk/Data/Table.html`, `/en/Feedback/Alert.html`)
- SEO-оптимізовані з `<title>` та `<meta>` для кожного компонента
- Маршрутизація за категоріями (`/Data/`, `/Feedback/`, `/Forms/`, `/Actions/`, `/System/`)
- i18n навбар з атрибутами `data-i18n`

Як запустити сайт документації?

```bash
npm run docs:dev
```

## Демо-пісочниця

Бібліотека містить багаті демо-приклади:

- [Форма реєстрації](../../play/registration.form.js)
- [Обмін валют](../../play/currency.exchange.js)
- [Мобільне поповнення](../../play/topup.telephone.js)
- [Вибір мови](../../play/language.form.js)

Запустіть для дослідження функціональності:

Як запустити пісочницю?

```bash
# Клонуйте репозиторій та запустіть пісочницю
git clone https://github.com/nan0web/ui.git
cd ui
npm install
npm run play
```

## Документація API

Детальна документація API доступна в JSDoc кожного класу.
Досліджуйте:

- [Повідомлення](../../src/core/Message/)
- [Форми](../../src/core/Form/)
- [Потік](../../src/core/Stream.js)
- [Компоненти](../../src/Component/)
- [Вигляд](../../src/View/)
- [Застосунок](../../src/App/)
- [Моделі](../../src/Model/)

## Архітектура проєкту та специфікації

Як спроєктовано універсальну блок-специфікацію? — [дивіться Universal Blocks Spec (`project.md`)](../../project.md)

## Участь у розробці

Як долучитися? — [дивіться тут](../../CONTRIBUTING.md)

## Ліцензія

ISC ліцензія — [дивіться тут](../../LICENSE)
