# @nan0web/ui

|[Статус](https://github.com/nan0web/monorepo/blob/main/system.md#написання-сценаріїв)|Документація|Тестове покриття|Фічі|Версія npm|
|---|---|---|---|---|
 |🟢 `96.6%` |🧪 [English 🏴󠁧󠁢󠁥󠁮󠁧󠁿](https://github.com/nan0web/ui/blob/main/README.md)<br />[Українською 🇺🇦](https://github.com/nan0web/ui/blob/main/docs/uk/README.md) |🟡 `81.1%` |✅ d.ts 📜 system.md 🕹️ playground |— |

Легкий, незалежний UI‑фреймворк, створений за філософією **nan0web** — 
одна логіка програми, багато UI‑реалізацій.

Бібліотека надає базові класи та утиліти для побудови структурованих інтерфейсів.
Вона підтримує:

- Обмін повідомленнями (Input/Output)
- Форми з валідацією
- Відстеження прогресу
- Рендеринг компонентів
- Управління представленням за допомогою Frame‑рендерингу
- Архітектуру додатку з core‑ та user‑частинами

Працює синхронно та асинхронно, у терміналі та у веб‑програмах,
зосереджуючись на типобезпеці, мінімалізмі та чистому JavaScript.

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

UI‑комунікація будована навколо повідомлень:

- **`UIMessage`** – базовий абстрактний клас повідомлення
- **`InputMessage`** – повідомлення користувача (значення, опції)
- **`OutputMessage`** – системне повідомлення (вміст, помилка, пріоритет)

Повідомлення — прості, серіалізовані контейнери даних. Вони допомагають будувати
розслаблену комунікацію між UI‑компонентами.

Як створити вхідне та вихідне повідомлення?
```js
import { InputMessage, OutputMessage } from '@nan0web/ui'

const input = InputMessage.from({ value: 'Hello User' })
const output = OutputMessage.from({ content: ['Welcome to @nan0web/ui'] })
console.info(input.value) // ← Hello User
console.info(output.content[0]) // ← Welcome to @nan0web/ui
```

### Форми

`UIForm` підтримує визначення полів, управління даними та схему валідації.
Кожна форма має заголовок, список полів та поточний стан.

Типи полів:

- `text`
- `email`
- `number`
- `select`
- `checkbox`
- `textarea`

Як визначити та валідати форму?
```js
import { UIForm } from '@nan0web/ui'

const form = new UIForm({
	title: "Contact Form",
	fields: [
		FormInput.from({ name: "email", label: "Email Address", type: "email", required: true }),
		FormInput.from({ name: "message", label: "Your Message", type: "textarea", required: true })
	],
	state: {
		email: "invalid-email",
		message: "Hello!"
	}
})

const result = form.validate()
console.info(result.isValid) // ← false
console.info(result.errors.email) // ← Invalid email format
```

### Компоненти

Компоненти рендерять дані у вигляді готових до виведення кадрів.

- `Welcome` – привітання користувача за ім’ям
- `Process` – індикатор прогресу

Як відрендерити компонент Welcome?
```js
import { Welcome } from '@nan0web/ui'

const frame = Welcome({ user: { name: "Alice" } })
const firstLine = frame[0].join("")
console.info(firstLine) // ← Welcome Alice!
```

### Менеджер представлення (View)

`View` поєднує компоненти та рендерить кадри.

Кожне представлення має:

- Локаль – форматування тексту, чисел, валют
- StdIn / StdOut – потоки вводу/виводу
- Frame – буфер виводу з візуальними властивостями

Як вивести кадр за допомогою View?
```js
import { View } from '@nan0web/ui'

const view = new View()
view.render(1)(["Hello, world"])
console.info(String(view.frame)) // ← "\rHello, world"
```

### Рендеринг кадрів (Frame)

`Frame` керує візуальним рендерингом з обмеженнями ширини та висоти.
Корисно для терміналів фіксованого розміру або блокових UI.

Як створити кадр фіксованого розміру?
```js
import { Frame } from '@nan0web/ui'

const frame = new Frame({
	value: [["Frame content"]],
	width: 20,
	height: 5,
	renderMethod: Frame.RenderMethod.APPEND,
})

const rendered = frame.render()
console.info(rendered.includes("Frame content")) // ← true
```

### Архітектура додатку (App)

`App` забезпечує основну логіку програми.

- Core – мінімальний UI‑шар
- User – користувацькі UI‑команди

Кожен додаток реєструє команди та прив’язує їх до UI‑дій.

Як створити простий користувацький додаток, який вітає?
```js
import { App, View } from '@nan0web/ui'

const app = new App.User.App({ name: "GreetApp" })
const view = new View()
view.register("Welcome", Welcome)

const cmd = App.Command.Message.parse("welcome --user Bob")
const result = await app.processCommand(cmd, new App.User.UI(app, view))
console.info(String(result)) // ← Welcome Bob!
```

### Моделі

UI‑моделі – це прості об’єкти даних, що керуються класами `Model`.

- `User` – дані користувача

Як використовувати модель User?
```js
import { Model } from '@nan0web/ui'

const user = new Model.User({ name: "Charlie", email: "charlie@example.com" })
console.info(user.name) // ← Charlie
console.info(user.email) // ← charlie@example.com
```

### Тестування UI

Основні модулі покриті юніт‑тестами для забезпечення стабільності у різних середовищах.

Як тестувати UI‑компоненти за допомогою асерцій?
```js
import { Welcome, InputMessage } from '@nan0web/ui'

const output = Welcome({ user: { name: "Test" } })
const input = InputMessage.from({ value: "test" })
console.log(output[0].join("")) // ← Welcome Test!
```

## Демо‑плейграунди

Бібліотека містить багаті демо‑плейграунди:

- [Форма реєстрації](./playground/registration.form.js)
- [Обмін валют](./playground/currency.exchange.js)
- [Поповнення мобільного телефону](./playground/topup.telephone.js)
- [Вибір мови](./playground/language.form.js)

Як запустити плейграунд?
```bash
# Клонувати репозиторій та запустити плейграунд
git clone https://github.com/nan0web/ui.git
cd ui
npm install
npm run playground
```

## API Документація

Детальна API‑документація доступна у JSDoc кожного класу.
Перегляньте:

- [Повідомлення](./src/core/Message/)
- [Форми](./src/core/Form/)
- [Поток (Stream)](./src/core/Stream.js)
- [Компоненти](./src/Component/)
- [View](./src/View/)
- [App](./src/App/)
- [Моделі](./src/Model/)

## Внесок у проєкт

Як зробити внесок? – [докладніше тут](./CONTRIBUTING.md)

## Ліцензія

Як ознайомитися з ліцензією ISC? – [докладніше тут](./LICENSE)
