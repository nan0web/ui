# @nan0web/ui

🏴󠁧󠁢󠁥󠁮󠁧󠁿 [English](./README.md) | 🇺🇦 [Українською](./docs/uk/README.md)

<!-- %PACKAGE_STATUS% -->

A lightweight, agnostic UI framework designed with the **nan0web philosophy**
— one application logic, many UI implementations.

This library provides core classes and utilities for building structured user interfaces.
It supports:

- Messaging (Input/Output)
- Forms with validation
- Progress tracking
- Component rendering
- View management with Frame rendering
- App structure with core and user apps

Built to work in sync or async, terminal-based or web-based apps,
focusing on type safety, minimalism, and pure JavaScript design.

## Installation

How to install with npm?
```bash
npm install @nan0web/ui
```

How to install with pnpm?
```bash
pnpm add @nan0web/ui
```

How to install with yarn?
```bash
yarn add @nan0web/ui
```

## Concepts & Architecture

### Message Flow

UI communication is built around messages:

- **`UiMessage`** – abstract message base class
- **`OutputMessage`** – system output (content, error, priority)

Messages are simple, serializable data containers. They help build
decoupled communication systems between UI components.

How to create input and output messages?
```js
import { InputMessage, OutputMessage } from '@nan0web/ui'
const input = UiMessage.from({ body: 'Hello User' })
const output = OutputMessage.from({ content: ['Welcome to @nan0web/ui'] })
console.info(input) // ← Message { body: "Hello User", head: {}, id: "....", type: "" }
console.info(String(output)) // ← Welcome to @nan0web/ui
```
### Forms

`UiForm` supports field definitions, data management, and schema validation.
Every form includes a title, fields, and current state.

Field types include:

- `text`
- `email`
- `number`
- `select`
- `checkbox`
- `textarea`

How to define and validate a UiForm?
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
const errors = form.validate()
console.info(errors.size) // ← 1
console.info(errors.get('email')) // ← Invalid email format
```
### Components

Components render data as frame-ready output.

- `Welcome` – greets user by name
- `Process` – shows progress bar and time

How to render the Welcome component?
```js
import { Welcome } from '@nan0web/ui'
const frame = Welcome({ user: { name: 'Alice' } })
const firstLine = frame[0].join('')
console.info(firstLine) // ← Welcome Alice!
```
### View Manager

`View` combines components and renders frames.

Every view has:

- Locale – formatted text, numbers, currency
- StdIn / StdOut – input/output streams
- Frame – output buffer with visual properties

How to render frame with View?
```js
import { View } from '@nan0web/ui'
const view = new View()
view.render(1)(['Hello, world'])
console.info(String(view.frame)) // ← "\rHello, world"
```
### Frame Rendering

`Frame` manages visual rendering with width and height limits.
Useful for fixed-size terminals or UI blocks.

Render methods:

- `APPEND` – adds content after previous frame
- `REPLACE` – erases and replaces full frame area
- `VISIBLE` – renders only visible part of frame

How to create a Frame with fixed size?
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
### Models

UI models are plain data objects managed by `Model` classes.

- `User` – user data

How to use a User model?
```js
import { Model } from '@nan0web/ui'
const user = new Model.User({ name: 'Charlie', email: 'charlie@example.com' })
console.info(user.name) // ← Charlie
console.info(user.email) // ← charlie@example.com
```
### Testing UI

Core unit-tested to ensure stability in different environments.

All components, adapters, and models are designed to be testable
with minimal setup.

How to test UI components with assertions?
```js
import { Welcome } from '@nan0web/ui'
const output = Welcome({ user: { name: 'Test' } })
console.info(output) // ← Welcome Test!
```
### Master IDE (Component Sandbox)

The Master IDE (OlmuiInspector) provides a unified environment for testing and documenting
web components across platforms. It supports:

- **NaN0 Spec** — a concise YAML-based shorthand for declaring component variations.
- **OlmuiInspector** — unified UI for exploring component models and props.
- **Live Preview** — real-time rendering of component states.
- **i18n UI** — fully localized interface for global developers.

It follows the **Olmui** core pattern: *One Logic — Many UI* (same manifest powers both CLI and Web).

#### NaN0 Spec (YAML)

Concise format for defining variations:

How to define a component variation using NaN0 Spec?
```yaml
- Button: Primary
  $variant: brand
  $outline: true
```

## Playground Demos

The library includes rich playground demos:

- [Registration Form](./play/registration.form.js)
- [Currency Exchange](./play/currency.exchange.js)
- [Mobile Top-up](./play/topup.telephone.js)
- [Language Selector](./play/language.form.js)

Run to explore live functionality:

How to run the playground?
```bash
# Clone repository and run playground
git clone https://github.com/nan0web/ui.git
cd ui
npm install
npm run play
```

## API Documentation

Detailed API docs are available in each class JSDoc.
Explore:

- [Messages](./src/core/Message/)
- [Forms](./src/core/Form/)
- [Stream](./src/core/Stream.js)
- [Components](./src/Component/)
- [View](./src/View/)
- [App](./src/App/)
- [Models](./src/Model/)

## Project Architecture & Specs

How the universal block spec is designed? - [check Universal Blocks Spec (`project.md`)](./project.md)

## Contributing

How to contribute? - [check here](./CONTRIBUTING.md)

## License

How to license ISC? - [check here](./LICENSE)
