/**
 * README.md GENERATOR covered by tests.
 */
import { describe, it, after, before, beforeEach } from "node:test"
import assert from "node:assert"
import FS from "@nan0web/db-fs"
import { NoConsole } from "@nan0web/log"
import { DocsParser } from "@nan0web/test"
import { InputMessage, OutputMessage, UIMessage, UIForm, UIStream } from "./core/index.js"

const fs = new FS()
let pkg = {}
const originalConsole = console

/**
 * Core test suite that also serves as the source for README generation.
 */
function testRender() {
	before(async () => {
		pkg = await fs.loadDocument("package.json", pkg)
	})
	beforeEach(() => {
		// @ts-ignore
		console = new NoConsole()
	})
	after(() => {
		console = originalConsole
	})
	/**
	 * @docs
	 * # @nan0web/ui
	 * Агностичний UI фреймворк для багатошарових додатків.
	 * Одна логіка, багато інтерфейсів.
	 *
	 * ## Функціональність
	 *
	 * - Базові повідомлення: `InputMessage`, `OutputMessage`
	 * - Форми та їх валідація
	 * - Потокові операції
	 * - Абстрактні адаптери
	 */
	it("Встановлення пакету через npm", async () => {
		/**
		 * ```bash
		 * npm install @nan0web/ui
		 * ```
		 */
		assert.ok(pkg.name.includes("@nan0web/ui"))
	})

	/**
	 * @docs
	 * ## Приклади використання
	 */
	it("Створення та використання повідомлень", () => {
		//import { InputMessage, OutputMessage } from '@nan0web/ui'

		const input = InputMessage.from({ value: 'Hello' })
		const output = OutputMessage.from({ content: ['Hello World'] })
		assert.ok(input instanceof InputMessage)
		assert.ok(output instanceof OutputMessage)
		assert.equal(input.value, 'Hello')
		assert.equal(output.content[0], 'Hello World')
	})

	/**
	 * @docs
	 * ## Основні класи
	 *
	 * - `UIMessage` - базовий клас для всіх повідомлень
	 * - `InputMessage` - для отримання даних від користувача
	 * - `OutputMessage` - для відображення даних
	 * - `UIForm` - для роботи з формами
	 * - `UIStream` - для асинхронних операцій
	 */
	it("Основні класи доступні через експорт", async () => {
		/** @docs */
		assert.ok(UIMessage)
		assert.ok(InputMessage)
		assert.ok(OutputMessage)
		assert.ok(UIForm)
		assert.ok(UIStream)
	})

	/**
	 * @docs
	 * ## API Документація
	 *
	 * Документація доступна через JSDoc коментарі в коді.
	 *
	 * ### Приклади використання форм
	 * - [Конвертація валют](./playground/currency.exchange.js)
	 * - [Форма реєстрації](./playground/registration.form.js)
	 * - [Поповнонення рахунку мобільного телефону](./playground/topup.telephone.js)
	 */
	it("Для запуску використовуй:", () => {
		/**
		 * ```bash
		 * pnpm playground
		 * ```
		 */
		assert.ok(String(pkg.scripts?.playground).includes("node playground"))
	})
	/**
	 * ## Тестування
	 */
	it("Запуск тестів через npm test", () => {
		/**
		 * ```bash
		 * npm test
		 * ```
		 */
		assert.ok(String(pkg.scripts?.test).includes("node --test"))
	})

	/**
	 * @docs
	 * ## Ліцензія
	 *
	 * [ISC License](./LICENSE)
	 */
	it("Ліцензія ISC вказана в package.json", async () => {
		const license = await fs.loadDocument("LICENSE")
		assert.ok(license.includes("ISC License"))
	})
}

describe("README.md", testRender)

describe("Rendering README.md", async () => {
	let text = ""
	const format = new Intl.NumberFormat("en-US").format
	const parser = new DocsParser()
	text = String(parser.decode(testRender))
	await fs.saveDocument("README.md", text)

	it(`document is rendered in README.md [${format(Buffer.byteLength(text))}b]`, async () => {
		const text = await fs.loadDocument("README.md")
		assert.ok(text.includes("# @nan0web/ui"))
	})
})
