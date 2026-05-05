# @nan0web/ui

🇺🇦 [Українською](./README.md) | 🏴󠁧󠁢󠁥󠁮󠁧󠁿 [English](../en/README.md)

<!-- %PACKAGE_STATUS% -->

Легкий, агностичний UI-фреймворк, розроблений за філософією **nan0web**
— одна логіка додатка, багато UI-реалізацій (One Logic — Many UI).

Ця бібліотека надає базові класи та утиліти для побудови структурованих інтерфейсів користувача.
Вона підтримує:

- Обмін повідомленнями (Input/Output)
- Форми з валідацією
- Відстеження прогресу
- Рендеринг компонентів
- Керування представленням через Frame Rendering
- Структуру додатків (Core та User Apps)

Створено для роботи в синхронних або асинхронних режимах, у термінальних або веб-додатках, з акцентом на типізацію, мінімалізм та чистий JavaScript.

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

## Концепції та Архітектура

### Потік повідомлень (Message Flow)

Комунікація в UI побудована навколо повідомлень:

- **`UiMessage`** – абстрактний базовий клас повідомлення.
- **`OutputMessage`** – системний вивід (вміст, помилка, пріоритет).

Повідомлення — це прості серіалізовані контейнери даних. Вони допомагають будувати слабкопов'язані системи комунікації між компонентами.

Як створювати вхідні та вихідні повідомлення?
```js
import { InputMessage, OutputMessage } from '@nan0web/ui'
const input = UiMessage.from({ body: 'Привіт, Користувачу' })
const output = OutputMessage.from({ content: ['Ласкаво просимо до @nan0web/ui'] })
console.info(input) // ← Message { body: "Привіт, Користувачу", head: {}, id: "....", type: "" }
console.info(String(output)) // ← Ласкаво просимо до @nan0web/ui
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
	title: 'Контактна форма',
	fields: [
		FormInput.from({ name: 'email', label: 'Email адреса', type: 'email', required: true }),
		FormInput.from({
			name: 'message',
			label: 'Ваше повідомлення',
			type: 'textarea',
			required: true,
		}),
	],
	state: {
		email: 'invalid-email',
		message: 'Привіт!',
	},
})
const { isValid, errors } = form.validate()
console.info(Object.keys(errors).length) // ← 1
console.info(errors.email) // ← Invalid email format
```

### Компоненти

Компоненти рендерить дані як готовий вивід для фрейму.

- `Welcome` – вітає користувача за ім'ям.
- `Process` – показує прогрес-бар та час.

Як відрендерити компонент Welcome?
```js
import { Welcome } from '@nan0web/ui'
const frame = Welcome({ user: { name: 'Аліса' } })
const firstLine = frame[0].join('')
console.info(firstLine) // ← Welcome Аліса!
```

### Менеджер представлення (View Manager)

`View` поєднує компоненти та рендерить фрейми.

Кожне представлення має:

- Локаль (Locale) – форматування тексту, чисел, валюти.
- StdIn / StdOut – потоки вводу/виводу.
- Frame – вихідний буфер з візуальними властивостями.

Як рендерити фрейм через View?
```js
import { View } from '@nan0web/ui'
const view = new View()
view.render(1)(['Привіт, світ'])
console.info(String(view.frame)) // ← "\rПривіт, світ"
```

### Рендеринг фреймів (Frame Rendering)

`Frame` керує візуальним рендерингом з обмеженнями ширини та висоти.
Корисно для терміналів фіксованого розміру або блоків UI.

Методи рендерингу:

- `APPEND` – додає контент після попереднього фрейму.
- `REPLACE` – очищує та замінює всю область фрейму.
- `VISIBLE` – рендерить лише видиму частину фрейму.

Як створити фрейм фіксованого розміру?
```js
import { Frame } from '@nan0web/ui'
const frame = new Frame({
	value: [['Вміст фрейму']],
	width: 20,
	height: 5,
	renderMethod: Frame.RenderMethod.APPEND,
})
const rendered = frame.render()
console.info(rendered.includes('Вміст фрейму')) // ← true
```

### Доменні Моделі (v1.9.0)

Версія v1.9.0 представляє повний набір доменних моделей для лейауту та компонентів.
Ці моделі слідують патерну **Model-as-Schema**.

#### Моделі Лейауту
- `HeaderModel` — заголовок, логотип, навігаційні дії.
- `FooterModel` — копірайт, версія, соціальні посилання.
- `HeroModel` — головний заклик до дії (CTA).

#### Базові елементи HTML5
Повна типізована підтримка стандартних тегів: `div`, `span`, `p`, `h1`-`h6`, `a`, `ul`, `table` тощо, а також базові SVG (`svg`, `path`, `rect`). Дані повинні бути у стандартному `camelCase`.

#### Моделі компонентів
- `PricingModel` / `PricingSection` — плани з функціями та цінами.
- `FeatureGrid` — сітка ключових особливостей.
- `ProfileDropdown` — аватар користувача та меню налаштувань.
- `CommentModel` & `TestimonialModel` — соціальні докази (відгуки).
- `StatsModel` — візуалізація даних (статистика).
- `TimelineModel` — історія подій (таймлайн).

Як використовувати контейнер Models?
```js
import { Models } from '@nan0web/ui'
const { HeaderModel, HeroModel } = Models
const header = new HeaderModel({
	title: 'NaN•Web',
	logo: '/logo.svg',
	actions: [/** @type {any} */ ({ title: 'Документація', href: '/docs' })],
})
const hero = new HeroModel({
	title: 'One Logic — Many UI',
	actions: [/** @type {any} */ ({ title: 'Почати', href: '/start' })],
})
console.info(header.title) // ← NaN•Web
console.info(hero.actions[0].title) // ← Почати
```

### Успадкування моделей та нормалізація (v1.12.3)

З версії v1.12.3 система підтримує надійне успадкування статичних метаданих.
Дочірні класи автоматично успадковують та можуть перевизначати поля батьківських класів.

Крім того, вхідні дані автоматично нормалізуються:
- `boolean`: Рядки `"0"`, `"1"`, `"false"`, `"true"` приводяться до справжніх логічних значень.
- `number`: Порожні рядки `""` приводяться до `0`.

Як використовувати успадкування та нормалізацію моделей?
```js
import { Model } from '@nan0web/ui'
class Base extends Model {
	static timeout = { type: 'number', default: 30 }
	constructor(data = {}, options = {}) {
		super(data, options)
		/** @type {number} */
		this.timeout
	}
}
class Child extends Base {
	static dir = { default: '.' }
	constructor(data = {}, options = {}) {
		super(data, options)
		/** @type {string} */
		this.dir
	}
}
const instance = new Child({ timeout: '10' })
console.info(instance.timeout) // ← 10 (number)
console.info(instance.dir) // ← . (default від батька/себе)
```

### Генератори інтентів (v1.11.0)

Починаючи з v1.11.0, творці інтентів (Intent creators) є стандартними іменованими функціями, що генерують суворі взаємодії (ask, progress, show, render, result).

- `ask(field, schema)` — запитує ввід від оточення.
- `progress(message)` — оновлює візуальний завантажувач.
- `show(message, level, data)` — відображає сповіщення (замінює застарілий `log`).
- `render(component, props)` — рендерить специфічний вигляд компонента.
- `result(data)` — чисто завершує виконання моделі.

Як використовувати генератори інтентів? (v1.11.0)
```js
import { ask, show, result } from '@nan0web/ui'
const nameIntent = ask('name', { help: 'Ваше ім\'я' })
const msgIntent = show('Обробка...', 'info')
const endIntent = result({ ok: true })
```

### Тестування UI (v1.11.0 Deterministic Testing)

Ядро протестоване юніт-тестами для забезпечення стабільності в різних середовищах.
У версії **v1.11.0** архітектура формально впроваджує `ScenarioTest` для детермінованого тестування без вводу/виводу.

Виносячи асинхронну логіку та надаючи явний масив сценаріїв, моделі обчислюються миттєво, не чекаючи на затримки вводу користувача.

Як детерміновано тестувати пайплайни моделей?
```js
import { ModelAsApp, ask, result, show } from '@nan0web/ui'
import { ScenarioTest } from '@nan0web/ui/test/ScenarioTest.js'

class ShoppingCartApp extends ModelAsApp {
	async *run() {
		const product = /** @type {import('../core/Intent.js').AskResponse} */ (
			yield ask('product', { help: 'Оберіть товар' })
		)
		if (product?.value === 'laptop') {
			yield show('Гарний вибір!', 'success')
		}
		const confirm = /** @type {import('../core/Intent.js').AskResponse} */ (
			yield ask('confirm', { help: 'Підтвердити покупку?' })
		)
		return result({ product: product?.value, confirm: confirm?.value })
	}
}
const res = await ScenarioTest.run(ShoppingCartApp, [
	{ field: 'product', value: 'laptop' },
	{ field: 'confirm', value: true },
])
```

### Story Testing (.nan0 spec files)

Помічник `SpecRunner.executeFile` дозволяє автоматично запускати `.nan0` специфікації без складного налаштування DBFS.

Як автоматично виконувати .nan0 файли специфікацій?
```js
import { SpecRunner } from '@nan0web/ui/testing'
```

### Master IDE (Component Sandbox)

Master IDE (OlmuiInspector) надає уніфіковане середовище для тестування та документування веб-компонентів. Вона підтримує:

- **NaN0 Spec** — лаконічний YAML-формат для опису варіацій компонентів.
- **OlmuiInspector** — уніфікований UI для дослідження моделей та властивостей.
- **Live Preview** — рендеринг станів компонентів у реальному часі.
- **i18n UI** — повністю локалізований інтерфейс (UK/EN) для розробників.
- **Theme Editor** — система CSS-змінних для кастомізації теми.

####NaN0 Spec (YAML)

Приклад опису варіації компонента:
```yaml
- Button: Primary
  $variant: brand
  $outline: true
```

## Демонстраційні майданчики (Playground)

Бібліотека містить багаті приклади використання:

- [Форма реєстрації](./play/registration.form.js)
- [Обмін валют](./play/currency.exchange.js)
- [Поповнення мобільного](./play/topup.telephone.js)
- [Вибір мови](./play/language.form.js)

Як запустити Playground?
```bash
# Клонуйте репозиторій та запустіть playground
git clone https://github.com/nan0web/ui.git
cd ui
npm install
npm run play
```

## Архітектура та Специфікації проєкту

- [Архітектура пакету (`architecture.md`)](./architecture.md)
- [Архітектура каталогів та фільтрів (`architecture-catalog.md`)](./architecture-catalog.md)
- [Специфікація універсальних блоків (`project.md`)](./project.md)

## Внесок (Contributing)

Як долучитися до розробки? - [Дивіться тут](./CONTRIBUTING.md)

## Ліцензія

Ліцензія ISC - [деталі тут](./LICENSE)
