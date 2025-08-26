import { describe, it } from "node:test"
import { strict as assert } from "node:assert"
import UIStream from "./Stream.js"

describe("UIStream", () => {
	it("should create processor generator", async () => {
		const controller = new AbortController()
		const processorFn = () => Promise.resolve("test result")
		const generator = UIStream.createProcessor(controller.signal, processorFn)

		assert.equal(typeof generator, "function")

		for await (const item of generator()) {
			assert.equal(item, "test result")
			break
		}
	})

	it("should handle aborted signal", async () => {
		const controller = new AbortController()
		controller.abort()

		const processorFn = () => Promise.resolve("test result")
		const generator = UIStream.createProcessor(controller.signal, processorFn)

		for await (const item of generator()) {
			assert.deepEqual(item, { done: true, canceled: true })
			break
		}
	})

	it("should process stream with callbacks", async () => {
		const controller = new AbortController()
		let progressCalled = false
		let completeCalled = false

		const generatorFn = async function* () {
			yield { progress: 0.5 }
			yield { done: true }
		}

		const onProgress = () => { progressCalled = true }
		const onComplete = () => { completeCalled = true }

		await UIStream.process(
			controller.signal,
			generatorFn,
			onProgress,
			null,
			onComplete
		)

		assert.ok(progressCalled)
		assert.ok(completeCalled)
	})

	it("should handle errors in stream processing", async () => {
		const controller = new AbortController()
		let errorCalled = false

		const generatorFn = async function* () {
			yield { error: "test error" }
		}

		const onError = () => { errorCalled = true }

		await UIStream.process(
			controller.signal,
			generatorFn,
			null,
			onError,
			null
		)

		assert.ok(errorCalled)
	})
})
