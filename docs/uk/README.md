# @nan0web/ui

|[Статус](https://github.com/nan0web/monorepo/blob/main/system.md#написання-сценаріїв)|Документація|Тестове покриття|Фічі|Версія npm|
|---|---|---|---|---|
 |🟢 `96.8%` |🧪 [English 🏴󠁧󠁢󠁥󠁮󠁧󠁿](https://github.com/nan0web/ui/blob/main/README.md)<br />[Українською 🇺🇦](https://github.com/nan0web/ui/blob/main/docs/uk/README.md) |🟡 `81.1%` |✅ d.ts 📜 system.md 🕹️ playground |1.0.1 |

Легкий, незалежний UI-фреймворк, створений за **філософією nan0web** —
одна логіка програми, багато UI-реалізацій.

Ця бібліотека надає основні класи та утиліти для побудови структурованих інтерфейсів користувача.
Вона підтримує:

- Обмін повідомленнями (Input/Output)
- Форми з валідацією
- Відстеження прогресу
- Рендеринг компонентів
- Керування представленнями за допомогою Frame-рендерингу
- Архітектуру додатків з core- і user-додатками

Побудована для синхронної або асинхронної роботи, у терміналі або веб-додатках,
орієнтована на типобезпеку, мінімалізм і чистий JavaScript.

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

UI-комунікація будується навколо повідомлень:

- **`UIMessage`** – абстрактний базовий клас повідомлення
- **`InputMessage`** – повідомлення від користувача (значення, опції)
- **`OutputMessage`** – системне повідомлення (вміст, помилка, пріоритет)

Повідомлення є простими, серіалізованими контейнерами даних. Вони допомагають створювати
незалежні канали комунікації між UI-компонентами.

Як створити вхідне та вихідне повідомлення?
```js
import { InputMessage, OutputMessage } from '@nan0web/ui'

const input = InputMessage.from({ value: 'Hello User' })
const output = OutputMessage.from({ content: ['Welcome to @nan0web/ui'] })
console.info(input.value) // ← Hello User
console.info(output.content[0]) // ← Welcome to @nan0web/ui
```
### Форми

`UIForm` підтримує визначення полів, управління даними та валідацію схеми.
Кожна форма містить заголовок, поля і поточний стан.

Типи полів:

- `text`
- `email`
- `number`
- `select`
- `checkbox`
- `textarea`

Як визначити і валідувати UIForm?
```js
import { UIForm } from '@nan0web/ui'

const form = new UIForm({
  title: "Контактна форма",
  fields: [
    FormInput.from({ name: "email", label: "Email-адреса", type: "email", required: true }),
    FormInput.from({ name: "message", label: "Ваше повідомлення", type: "textarea", required: true })
  ],
  state: {
    email: "invalid-email",
    message: "Привіт!"
  }
})

const result = form.validate()
console.info(result.isValid) // ← false
console.info(result.errors.email) // ← Неправильний формат email

```
### Компоненти

Компоненти рендерять дані як готові до виведення кадри.

- `Welcome` – привітання користувача за ім'ям
- `Process` – показує індикатор прогресу та час

Як відрендерити компонент Welcome?
```js
import { Welcome } from '@nan0web/ui'

const frame = Welcome({ user: { name: "Аліса" } })
const firstLine = frame[0].join("")
console.info(firstLine) // ← Вітаємо, Аліса!
```
### Менеджер представлень (View)

`View` об'єднує компоненти та відображає кадри.

Кожне представлення має:

- Локаль – форматування тексту, чисел, валюти
- StdIn / StdOut – потоки вводу/виводу
- Frame – буфер виведення з візуальними властивостями

Як відобразити кадр за допомогою View?
```js
import { View } from '@nan0web/ui'

const view = new View()
view.render(1)(["Привіт, світ!"])
console.info(String(view.frame)) // ← "\rПривіт, світ!"
```
### Рендеринг кадрів (Frame)

`Frame` керує візуальним виведенням з обмеженнями ширини і висоти.
Корисний для терміналів фіксованого розміру або UI-блоків.

Методи рендерингу:

- `APPEND` – додає вміст після попереднього кадру
- `REPLACE` – стирає та замінює всю область кадру
- `VISIBLE` – рендерить лише видиму частину кадру

Як створити Frame фіксованого розміру?
```js
import { Frame } from '@nan0web/ui'

const frame = new Frame({
  value: [["Вміст кадру"]],
  width: 20,
  height: 5,
  renderMethod: Frame.RenderMethod.APPEND,
})

const rendered = frame.render()
console.info(rendered.includes("Вміст кадру")) // ← true
```
### Архітектура додатків (App)

`App` надає основну логіку програми.

- Core – мінімальний UI-шар
- User – специфічні UI-команди користувача

Кожен додаток реєструє команди та прив’язує їх до дій інтерфейсу.

Як створити базовий додаток користувача, який вітає?
```js
import { App, View } from '@nan0web/ui'

const app = new App.User.App({ name: "GreetApp" })
const view = new View()
view.register("Welcome", Welcome)

const cmd = App.Command.Message.parse("welcome --user Боб")
const result = await app.processCommand(cmd, new App.User.UI(app, view))
console.info(String(result)) // ← Вітаємо, Боб!
```
### Моделі

UI-моделі — це прості об’єкти даних, якими керують класи `Model`.

- `User` – дані користувача

Як використовувати модель User?
```js
import { Model } from '@nan0web/ui'

const user = new Model.User({ name: "Чарлі", email: "charlie@example.com" })
console.info(user.name) // ← Чарлі
console.info(user.email) // ← charlie@example.com
```
### Тестування інтерфейсів (UI)

Основні модулі мають повне покриття юніт-тестами, щоб забезпечити стабільність у різних середовищах.

Всі компоненти, адаптери та моделі розроблені для легкого тестування
без зайвих налаштувань.

Як тестувати UI-компоненти з перевірками?
```js
import { Welcome, InputMessage } from '@nan0web/ui'

const output = Welcome({ user: { name: "Тест" } })
const input = InputMessage.from({ value: "тест" })
console.log(output[0].join("")) // ← Вітаємо, Тест!
```
## Демо-плейграунди

У бібліотеці є багаті плейграунди-демо:

- [Форма реєстрації](./playground/registration.form.js)
- [Обмін валют](./playground/currency.exchange.js)
- [Поповнення мобільного телефону](./playground/topup.telephone.js)
- [Вибір мови](./playground/language.form.js)

Запустіть щоб дослідити живу функціональність:

Як запустити плейграунд?
```bash
# Клонуйте репозиторій і запустіть плейграунд
git clone https://github.com/nan0web/ui.git
cd ui
npm install
npm run playground
```

## Документація API

Детальна документація API доступна у JSDoc кожного класу.
Дослідіть:

- [Повідомлення](./src/core/Message/)
- [Форми](./src/core/Form/)
- [Потік (Stream)](./src/core/Stream.js)
- [Компоненти](./src/Component/)
- [View](./src/View/)
- [App](./src/App/)
- [Моделі](./src/Model/)

## Участь у розробці

Як взяти участь? – [перегляньте тут](./CONTRIBUTING.md)

## Ліцензія

Як поширюється ISC ліцензія? – [перегляньте тут](./LICENSE)
