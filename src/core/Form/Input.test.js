import { describe, it } from "node:test"
import { strict as assert } from "node:assert"
import FormInput from "./Input.js"

describe("FormInput", () => {
	it("should create instance with default values", () => {
		const input = new FormInput()
		assert.ok(input instanceof FormInput)
		assert.equal(input.type, FormInput.TYPES.TEXT)
		assert.equal(input.required, false)
		assert.equal(input.placeholder, "")
		assert.deepEqual(input.options, [])
	})

	it("should create instance with custom values", () => {
		const props = {
			type: "email",
			name: "email",
			label: "Email Address",
			required: true,
			placeholder: "Enter email",
			options: ["option1", "option2"],
			defaultValue: "test@example.com"
		}
		const input = new FormInput(props)
		assert.equal(input.type, "email")
		assert.equal(input.name, "email")
		assert.equal(input.label, "Email Address")
		assert.equal(input.required, true)
		assert.equal(input.placeholder, "Enter email")
		assert.deepEqual(input.options, ["option1", "option2"])
		assert.equal(input.defaultValue, "test@example.com")
	})

	it("should create from string", () => {
		const input = FormInput.from("testField")
		assert.equal(input.name, "testField")
		assert.equal(input.label, "testField")
	})

	it("should create from object", () => {
		const objInput = { name: "test", type: "text" }
		const input = FormInput.from(objInput)
		assert.ok(input instanceof FormInput)
		assert.equal(input.name, "test")
	})

	it("should check if input has options", () => {
		const selectInput = new FormInput({ type: "select", options: ["opt1"] })
		const textInput = new FormInput({ type: "text" })
		assert.ok(selectInput.hasOptions())
		assert.ok(!textInput.hasOptions())
	})

	it("should validate type", () => {
		const validInput = new FormInput({ type: "email" })
		const invalidInput = new FormInput({ type: "invalid" })
		assert.ok(validInput.isValidType())
		assert.ok(!invalidInput.isValidType())
	})
})