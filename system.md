# System intructions `system.md` / NaN•Web UI

Read the [nan0web instructions](../../system.md)

Vanilla javascript UI interfaces with no platform dependencies.  
Must work for nodejs, browser and other compilers that supports ESM.

## Requirements

### 1. Javascript

1.1. Pure vanilla js only.  
1.2. Platform abstract.  
1.3. Minimum dependency as possible.  
1.4. Classes  
1.4.1. Order of the class elements:

- static properties
- properties
- constructor
- getters
- setters
- base functions
- async functions
- static base functions
- static async functions

  1.5. Views, every must:  
  1.5.1. Have a separate file and test file `View/AppView.js` and `View/AppView.test.js`.  
  1.6. Components, every must:
  1.6.1. Have a separate directory in `View/Component/*` or registered from any other directory with files:

- `Component.js`
- `Component.test.js`
- `ComponentInput.js`
- `index.js`
  ```js
  export default Component
  export { ComponentInput }
  ```

### 2. Tests

Every model, component, class must have their own tests file to cover their functionality in isolated environment.

#### node:test

For the core (base), cgi and cli interfaces, and web interfaces non `.jsx` components `node:test` with `node:assert/strict` must be used for tests.

#### vitest

For `React` apps and any that uses `.jsx` components `vitest` must be used for tests.

## Interfaces

1. `base` - Самий базовий інтерфейс, який має описувати всі доступні для інтерфейсів функції + тести `node:test`.
1. `cli` - Console line application на основі команд через `argv[]` і вивід на екран за допомогою `@nan0web/log`.
1. `api` - API який працює постійно для надання даних для `web`, `mobile` та інших інтерфейсів.
1. `cgi` - Console graphic interface з віконцями і кнопками за допомогою `blessed`.
1. `web` - Веб інтерфейс з `Web.customElements`, `Lit`, або `React`.
1. `mobile` - Мобільний інтерфейс з `Ionic` або `Swift` і `Java`.
1. `desktop` - Веб інтерфейс у обкладинці `Electron` або `Tauri`.
1. `chat` - Чат інтерфейс `@nan0web/chat-ui`.
1. `audio` - Мовний (голосовий) інтерфейс `@nan0web/audio-ui`.

Базовий інтерфейс описує всі взаємодії і можливі функції.
Всі інші інтерфейси мають розширювати базовий.

Інтерфейси клієнти, у випадку коли є окремий `api` сервер, можуть розширювати свій `ClientUI`.

Приклад успадкування:

```js
import UI from '@nan0web/ui'

class BaseUI extends UI {}

class CliUI extends BaseUI {}

class APIUI extends CliUI {}

class CgiUI extends CliUI {}

class WebUI extends BaseUI {}

class MobileUI extends BaseUI {}

class DesktopUI extends WebUI {}

class ChatUI extends BaseUI {}

class AudioUI extends ChatUI {}
```

### Views

#### Widgets

Widget is a control alement including a view with and ask() ability to input data.

#### Output

Output data is passed to the view but also in specific format:

```js
function UserDocumentsView(input = {}) {
  input = UserDocumentsInput.from(input)
  if (empty(input)) {
    throw new Error('Input data required in a format off UserDocumentsInput')
  }

  return Frame.from([['Documents'], ...input.documents.map((d) => d.name)])
}
```

In this scenario I can easily define Input classes for the every View and Widget to be sure all the input pass, and easily require the proper input from the app before running a job.

#### Input

When application needs any data it requires.

The input might be a command line `node start.js -user.name root` or, if not provided, user input through the provided infterface (any of CLI, API, voice, mobile, table, desktop, web, etc.)

```js
class App {
  async requireUser() {
    const user = await this.view.ask('User')()
    if (user instanceof User) return user
    throw new TypeError('User is required to continue')
  }
  async run() {
    const user = await this.requireUser()
    this.view.render('Welcome')({ user })
  }
}
```

## Cross platform

Very important that I can extend basic UI with different apps, for instance:

```jsx
// apps/web/src/components/User/DocumentsView.jsx
import React from 'react'
/** the very basic component **/
import UserDocumentsInput from 'src/components/User/DocumentsInput.js'

function UserDocumentsView(input = {}) {
  input = UserDocumentsInput.from(input)
  if (empty(input)) {
    throw new Error('Input data required in a format off UserDocumentsInput')
  }

  return (
    <div>
      <h3>Documents</h3>
      <ul>
        {input.documents.map((d, i) => (
          <li key={i}>{d.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

### Apps locations

#### Core application

Core application s with the minimum stdin, stdout

- `src/*`
- `src/App.js`
- `bin/start.js`
- `package.json`

Core application might have own resository, for instance `@nan0web/app`.

#### CLI application

CLI application can utilize `blessed` or other CLI library for rich UI experience, compared to Core.

- `apps/cli/src/*`
- `apps/cli/bin/start.js`
- `apps/cli/package.json`

#### Web application

Web applications can utilize `react` or `lit` or other Web UI library for rich UI experience.
Most desired is `lit` to avoid using typescript or jsx.

- `apps/web/src/*`
- `apps/web/bin/start.js`
- `apps/web/package.json`

## The Holy Grail: Capability Discovery & OLMUI Architecture

В архітектурі **NaN•Web OLMUI (One Logic — Many UI)** ключовим патерном є абсолютне відокремлення візуального інтерфейсу від бізнес-логіки.
Цей концепт (Святий Грааль крос-платформності) базується на двох аксіомах:

### Аксіома 1. Якщо описана модель і її наміри, то описано і додаток

_Будь-який додаток (`nan.app` або `nan.package`) розглядається виключно як набір декларативних Моделей (Model-as-Schema) та доступних намірів (Intents/Actions). Всі розширені інтерфейси і нові компоненти UI також описуються і експортуються. UI та Оркестратор імплементуються окремо, оброблюючи цю еталонну декларацію._

1. **Додаток як Джерело Правди (Source of Truth)**: Замість того, щоб в'ювер або редактор хардкодив список дій чи кнопок, додаток сам експортує їх як Схему. Додаток заявляє: _"Я вмію робити `subscribe`, `checkout`, `open-modal`, `next-page`"_.
2. **Capability Discovery (Виявлення Можливостей)**: Будь-який Контент-Редактор (чи AI-асистент) може прочитати маніфест додатку, розпізнати доступні екшени і згенерувати інтерфейс на їх основі (наприклад, випадаючий список дій для додавання кнопки).
3. **Data-Driven Decoupling**: Компонент `ContentViewer` (чи інший віджет) взагалі не прив'язується до логіки бізнесу. Його завдання — тільки відрендерити кнопку і згенерувати "намір" `{ action: 'subscribe' }`. Якщо цю саму сторінку (YAML) перенести в інший додаток, де намір `subscribe` працює по-іншому (наприклад, не підписка на email, а донат) — кнопка органічно змінить поведінку, адже UI нічого не знає про логіку під капотом!

### Аксіома 2. Формула y = f(x)

Розробка UI та бізнес-логіки зводиться до універсальної математичної формули **y = f(x)**:

- **`f` (Функція)** — Кожна Модель додатку виступає як чітко типізована функція базису.
- **`x` (Вхідні Дані)** — Data з конструктора моделі: початковий стан, конфігурація, або контекст середовища.
- **`y` (Результат)** — Набір **намірів** (Intents), що повертаються як результат моделі `f`.

Генератор інтерфейсу (UI) або Оркестратор не обчислює логіку. Він тільки приймає `y` та малює/виконує результати залежно від адаптера платформи (Core/CLI/Web/Mobile/Chat/Voice/Robo).

Відтак, ми маємо одне джерело логіки `f` і безліч "дурних", але швидких споживачів-інтерпретаторів, що втілюють парадигму **One Logic, Many UI**.
