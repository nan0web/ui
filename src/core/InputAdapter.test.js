import { describe, it } from "node:test"
import { strict as assert } from "node:assert"
import InputAdapter from "./InputAdapter.js"

describe("InputAdapter", () => {
	it("should create instance", () => {
		const adapter = new InputAdapter()
		assert.ok(adapter instanceof InputAdapter)
	})

	it("should start and emit input message", () => {
		const adapter = new InputAdapter()
		let emitted = false
		let message = null
		
		adapter.on('input', (msg) => {
			emitted = true
			message = msg
		})
		
		adapter.start()
		assert.ok(emitted)
		assert.ok(message)
	})

	it("should stop without error", () => {
		const adapter = new InputAdapter()
		assert.doesNotThrow(() => adapter.stop())
	})

	it("should be ready by default", () => {
		const adapter = new InputAdapter()
		assert.ok(adapter.isReady())
	})
})