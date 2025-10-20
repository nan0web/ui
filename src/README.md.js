import { describe, it, before, beforeEach } from "node:test"
import assert from "node:assert/strict"
import FS from "@nan0web/db-fs"
import { NoConsole } from "@nan0web/log"
import {
	DatasetParser,
	DocsParser,
	runSpawn,
} from "@nan0web/test"
import {
	App,
	Component,
	Frame,
	InputMessage,
	Model,
	OutputMessage,
	UIMessage,
	UIForm,
	UIStream,
	View,
	FormInput,
} from "./index.js"
import { Welcome } from "./Component/index.js"

const fs = new FS()
let pkg

// Load package.json once before tests
before(async () => {
	const doc = await fs.loadDocument("package.json", {})
	pkg = doc || {}
})

let console = new NoConsole()

beforeEach((info) => {
	console = new NoConsole()
})

/**
 * Core test suite that also serves as the source for README generation.
 *
 * The block comments inside each `it` block are extracted to build
 * the final `README.md`. Keeping the comments here ensures the
 * documentation stays close to the code.
 */
function testRender() {
	/**
	 * @docs
	 * # @nan0web/ui
	 *
	 * <!-- %PACKAGE_STATUS% -->
	 *
	 * A lightweight, agnostic UI framework designed with the **nan0web philosophy**
	 * — one application logic, many UI implementations.
	 *
	 * This library provides core classes and utilities for building structured user interfaces.
	 * It supports:
	 *
	 * - Messaging (Input/Output)
	 * - Forms with validation
	 * - Progress tracking
	 * - Component rendering
	 * - View management with Frame rendering
	 * - App structure with core and user apps
	 *
	 * Built to work in sync or async, terminal-based or web-based apps,
	 * focusing on type safety, minimalism, and pure JavaScript design.
	 *
	 * ## Installation
	 */
	it("How to install with npm?", () => {
		/**
		 * ```bash
		 * npm install @nan0web/ui
		 * ```
		 */
		assert.equal(pkg.name, "@nan0web/ui")
	})
	/**
	 * @docs
	 */
	it("How to install with pnpm?", () => {
		/**
		 * ```bash
		 * pnpm add @nan0web/ui
		 * ```
		 */
		assert.equal(pkg.name, "@nan0web/ui")
	})
	/**
	 * @docs
	 */
	it("How to install with yarn?", () => {
		/**
		 * ```bash
		 * yarn add @nan0web/ui
		 * ```
		 */
		assert.equal(pkg.name, "@nan0web/ui")
	})

	/**
	 * @docs
	 * ## Concepts & Architecture
	 *
	 * ### Message Flow
	 *
	 * UI communication is built around messages:
	 *
	 * - **`UIMessage`** – abstract message base class
	 * - **`InputMessage`** – user input message (value, options)
	 * - **`OutputMessage`** – system output (content, error, priority)
	 *
	 * Messages are simple, serializable data containers. They help build
	 * decoupled communication systems between UI components.
	 */
	it("How to create input and output messages?", () => {
		//import { InputMessage, OutputMessage } from '@nan0web/ui'

		const input = InputMessage.from({ value: 'Hello User' })
		const output = OutputMessage.from({ content: ['Welcome to @nan0web/ui'] })
		console.info(input.value) // ← Hello User
		console.info(output.content[0]) // ← Welcome to @nan0web/ui
		assert.equal(input.value, 'Hello User')
		assert.equal(output.content[0], 'Welcome to @nan0web/ui')
	})

	/**
	 * @docs
	 * ### Forms
	 *
	 * `UIForm` supports field definitions, data management, and schema validation.
	 * Every form includes a title, fields, and current state.
	 *
	 * Field types include:
	 *
	 * - `text`
	 * - `email`
	 * - `number`
	 * - `select`
	 * - `checkbox`
	 * - `textarea`
	 */
	it("How to define and validate a UIForm?", () => {
		//import { UIForm } from '@nan0web/ui'

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

		assert.equal(result.isValid, false)
		assert.equal(result.errors.email, "Invalid email format")
	})

	/**
	 * @docs
	 * ### Components
	 *
	 * Components render data as frame-ready output.
	 *
	 * - `Welcome` – greets user by name
	 * - `Process` – shows progress bar and time
	 */
	it("How to render the Welcome component?", () => {
		//import { Welcome } from '@nan0web/ui'

		const frame = Welcome({ user: { name: "Alice" } })
		const firstLine = frame[0].join("")
		console.info(firstLine) // ← Welcome Alice!
		assert.equal(console.output()[0][1], "Welcome Alice!")
	})

	/**
	 * @docs
	 * ### View Manager
	 *
	 * `View` combines components and renders frames.
	 *
	 * Every view has:
	 *
	 * - Locale – formatted text, numbers, currency
	 * - StdIn / StdOut – input/output streams
	 * - Frame – output buffer with visual properties
	 */
	it("How to render frame with View?", () => {
		//import { View } from '@nan0web/ui'

		const view = new View()
		view.render(1)(["Hello, world"])
		console.info(String(view.frame)) // ← "\rHello, world"
		assert.ok(String(view.frame).includes("Hello, world"))
	})

	/**
	 * @docs
	 * ### Frame Rendering
	 *
	 * `Frame` manages visual rendering with width and height limits.
	 * Useful for fixed-size terminals or UI blocks.
	 *
	 * Render methods:
	 *
	 * - `APPEND` – adds content after previous frame
	 * - `REPLACE` – erases and replaces full frame area
	 * - `VISIBLE` – renders only visible part of frame
	 */
	it("How to create a Frame with fixed size?", () => {
		//import { Frame } from '@nan0web/ui'

		const frame = new Frame({
			value: [["Frame content"]],
			width: 20,
			height: 5,
			renderMethod: Frame.RenderMethod.APPEND,
		})

		const rendered = frame.render()
		console.info(rendered.includes("Frame content")) // ← true
		assert.ok(rendered.includes("Frame content"))
	})
	it("How to create a Frame with different render methods?", () => {
		//import { Frame } from '@nan0web/ui'

		const frame = new Frame({
			value: [["Frame content"]],
			width: 20,
			height: 5,
		})

		frame.renderMethod = Frame.RenderMethod.REPLACE
		const renderedReplace = frame.render()
		assert.ok(renderedReplace.includes("Frame content"))

		frame.renderMethod = Frame.RenderMethod.VISIBLE
		const renderedVisible = frame.render()
		assert.ok(renderedVisible.includes("Frame content"))
	})

	/**
	 * @docs
	 * ### App Architecture
	 *
	 * `App` provides the main application logic.
	 *
	 * - Core – minimal UI layer
	 * - User – user-specific UI commands
	 *
	 * Each app registers commands and binds them to UI actions.
	 */
	it("How to create a basic user app that greets?", async () => {
		//import { App, View } from '@nan0web/ui'

		const app = new App.User.App({ name: "GreetApp" })
		const view = new View()
		view.register("Welcome", Welcome)

		const cmd = App.Command.Message.parse("welcome --user Bob")
		const result = await app.processCommand(cmd, new App.User.UI(app, view))
		console.info(String(result)) // ← Welcome Bob!
		assert.ok(console.output()[0][1].includes("Welcome Bob!"))
	})

	/**
	 * @docs
	 * ### Models
	 *
	 * UI models are plain data objects managed by `Model` classes.
	 *
	 * - `User` – user data
	 */
	it("How to use a User model?", () => {
		//import { Model } from '@nan0web/ui'

		const user = new Model.User({ name: "Charlie", email: "charlie@example.com" })
		console.info(user.name) // ← Charlie
		console.info(user.email) // ← charlie@example.com
		assert.equal(user.name, "Charlie")
		assert.equal(user.email, "charlie@example.com")
	})

	/**
	 * @docs
	 * ### Testing UI
	 *
	 * Core unit-tested to ensure stability in different environments.
	 *
	 * All components, adapters, and models are designed to be testable
	 * with minimal setup.
	 */
	it("How to test UI components with assertions?", () => {
		//import { Welcome, InputMessage } from '@nan0web/ui'

		const output = Welcome({ user: { name: "Test" } })
		const input = InputMessage.from({ value: "test" })
		console.log(output[0].join("")) // ← Welcome Test!
		assert.equal(console.output()[0][1], "Welcome Test!")
		assert.ok(input instanceof InputMessage)
	})

	/**
	 * @docs
	 * ## Playground Demos
	 *
	 * The library includes rich playground demos:
	 *
	 * - [Registration Form](./playground/registration.form.js)
	 * - [Currency Exchange](./playground/currency.exchange.js)
	 * - [Mobile Top-up](./playground/topup.telephone.js)
	 * - [Language Selector](./playground/language.form.js)
	 *
	 * Run to explore live functionality:
	 */
	it("How to run the playground?", async () => {
		/**
		 * ```bash
		 * # Clone repository and run playground
		 * git clone https://github.com/nan0web/ui.git
		 * cd ui
		 * npm install
		 * npm run playground
		 * ```
		 */
		assert.ok(String(pkg.scripts?.playground).includes("node playground"))
		const response = await runSpawn("git", ["remote", "get-url", "origin"])
		assert.ok(response.code === 0, "git command fails (e.g., not in a git repo)")
		assert.ok(response.text.trim().endsWith(":nan0web/ui.git"))
	})

	/**
	 * @docs
	 * ## API Documentation
	 *
	 * Detailed API docs are available in each class JSDoc.
	 * Explore:
	 *
	 * - [Messages](./src/core/Message/)
	 * - [Forms](./src/core/Form/)
	 * - [Stream](./src/core/Stream.js)
	 * - [Components](./src/Component/)
	 * - [View](./src/View/)
	 * - [App](./src/App/)
	 * - [Models](./src/Model/)
	 *
	 * ## Contributing
	 */
	it("How to contribute? - [check here](./CONTRIBUTING.md)", async () => {
		assert.equal(pkg.scripts?.precommit, "npm test")
		assert.equal(pkg.scripts?.prepush, "npm test")
		assert.equal(pkg.scripts?.prepare, "husky")
		const text = await fs.loadDocument("CONTRIBUTING.md")
		const str = String(text)
		assert.ok(str.includes("# Contributing"))
	})

	/**
	 * @docs
	 * ## License
	 */
	it("How to license ISC? - [check here](./LICENSE)", async () => {
		/** @docs */
		const text = await fs.loadDocument("LICENSE")
		assert.ok(String(text).includes("ISC"))
	})
}

describe("README.md testing", testRender)

describe("Rendering README.md", async () => {
	let text = ""
	const format = new Intl.NumberFormat("en-US").format
	const parser = new DocsParser()
	text = String(parser.decode(testRender))
	await fs.saveDocument("README.md", text)
	const dataset = DatasetParser.parse(text, pkg.name)
	await fs.saveDocument(".datasets/README.dataset.jsonl", dataset)

	it(`document is rendered in README.md [${format(Buffer.byteLength(text))}b]`, async () => {
		const text = await fs.loadDocument("README.md")
		assert.ok(text.includes("## License"))
	})
})
