import { describe, it } from "node:test"
import { strict as assert } from "node:assert"
import UIMessage from "./Message.js"

describe("UIMessage", () => {
	it("should create instance with default values", () => {
		const msg = new UIMessage()
		assert.ok(msg instanceof UIMessage)
		assert.equal(typeof msg.type, "string")
		assert.equal(typeof msg.id, "string")
		assert.ok(msg.time instanceof Date)
	})

	it("should create instance with custom values", () => {
		const props = {
			type: "test",
			id: "custom-id",
			body: ["test content"]
		}
		const msg = new UIMessage(props)
		assert.equal(msg.type, "test")
		assert.equal(msg.id, "custom-id")
		assert.deepEqual(msg.body, ["test content"])
	})

	it("should generate unique id when not provided", () => {
		const msg1 = new UIMessage()
		const msg2 = new UIMessage()
		assert.notEqual(msg1.id, msg2.id)
	})

	it("should use content as body when body not provided", () => {
		const msg = new UIMessage({ content: ["hello"] })
		assert.deepEqual(msg.body, ["hello"])
	})

	it("should create from data using from() method", () => {
		const data = { type: "info", body: ["test"] }
		const msg = UIMessage.from(data)
		assert.ok(msg instanceof UIMessage)
		assert.equal(msg.type, "info")
		assert.deepEqual(msg.body, ["test"])
	})

	it("should validate type correctly", () => {
		const validMsg = new UIMessage({ type: UIMessage.TYPES.TEXT })
		const invalidMsg = new UIMessage({ type: "invalid-type" })
		assert.ok(validMsg.isValidType())
		assert.ok(!invalidMsg.isValidType())
	})

	it("should check if message is empty", () => {
		const emptyMsg = new UIMessage()
		const nonEmptyMsg = new UIMessage({ body: ["content"] })
		assert.ok(emptyMsg.isEmpty())
		assert.ok(!nonEmptyMsg.isEmpty())
	})
})
