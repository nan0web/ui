# @nan0web/ui
Агностичний UI фреймворк для багатошарових додатків.
Одна логіка, багато інтерфейсів.

## Функціональність

- Базові повідомлення: `InputMessage`, `OutputMessage`
- Форми та їх валідація
- Потокові операції
- Абстрактні адаптери

Встановлення пакету через npm
```bash
npm install @nan0web/ui
```

## Приклади використання

Створення та використання повідомлень
```js
import { InputMessage, OutputMessage } from '@nan0web/ui'

const input = InputMessage.from({ value: 'Hello' })
const output = OutputMessage.from({ content: ['Hello World'] })
```
## Основні класи

- `UIMessage` - базовий клас для всіх повідомлень
- `InputMessage` - для отримання даних від користувача
- `OutputMessage` - для відображення даних
- `UIForm` - для роботи з формами
- `UIStream` - для асинхронних операцій

Основні класи доступні через експорт

## API Документація

Документація доступна через JSDoc коментарі в коді.

### Приклади використання форм
- [Конвертація валют](./playground/currency.exchange.js)
- [Форма реєстрації](./playground/registration.form.js)
- [Поповнонення рахунку мобільного телефону](./playground/topup.telephone.js)

Для запуску використовуй:
```bash
pnpm playground
```

## Ліцензія

[ISC License](./LICENSE)

Ліцензія ISC вказана в package.json
```js
const license = await fs.loadDocument("LICENSE")
```