# UI Core Library

A lightweight UI‑core library that provides:

* **Message hierarchy** – `UIMessage`, `InputMessage`, `OutputMessage`, `FormMessage`.
* **Form handling** – `UIForm` with validation, schema support and state management.
* **Adapters** – abstract `InputAdapter` and `OutputAdapter` for plugging any UI implementation.
* **Stream utilities** – `UIStream` to process async operations with progress, cancellation and error handling.

## Installation

```bash
npm install @nan0web/ui
```

## Quick start

```js
import { UIForm, InputAdapter, OutputAdapter } from '@nan0web/ui'

// Define a form
const form = new UIForm({
	title: 'Contact',
	fields: [
		{ name: 'email', label: 'Email', type: 'email', required: true },
		{ name: 'message', label: 'Message', type: 'text', required: true }
	]
})

// Simple console input adapter
class ConsoleInput extends InputAdapter {
	start() {
		// Simulate user input after 1 s
		setTimeout(() => {
			this.emit('input', { value: 'test@example.com' })
		}, 1000)
	}
}

// Simple console output adapter
class ConsoleOutput extends OutputAdapter {
	render(msg) {
		console.log('OUTPUT:', msg.body.join('\n'))
	}
}

// Run the form
const input = new ConsoleInput()
const output = new ConsoleOutput()

input.on('input', ({ value }) => {
	form.setData({ email: value })
	const result = form.validate()
	if (result.isValid) {
		output.render({ body: ['Form submitted!'] })
	} else {
		output.render({ body: Object.values(result.errors) })
	}
})

input.start()
```

## API Overview

### Messages

| Class | Description |
|-------|-------------|
| `UIMessage` | Base message with `type`, `id`, `body` and meta. |
| `InputMessage` | Message coming from the user (value, options, waiting flag). |
| `OutputMessage` | Message sent to the UI (content, error, priority). |
| `FormMessage` | Specialized `OutputMessage` for form data (`data`, `schema`). |

### Form

* `new UIForm(props)` – create a form.
* `form.setData(data)` – returns a new form instance with merged state.
* `form.validate()` – validates all fields (required + schema) and returns `{isValid, errors}`.
* `form.validateField(name, value)` – validates a single field.
* `form.toJSON()` – serialises the form.

### Adapters

* Extend `InputAdapter` and implement `start()`/`stop()` to emit `'input'` events.
* Extend `OutputAdapter` and implement `render(message)` to display output.

### Stream

* `UIStream.createProcessor(signal, fn)` – creates an async generator.
* `UIStream.process(signal, generator, onProgress, onError, onComplete)` – runs the generator with callbacks.

## Testing

All components are covered with unit tests using Node’s built‑in `test` runner.

```bash
npm test
```

## License

ISC
