import { describe, it } from "node:test"
import { strict as assert } from "node:assert"
import View from "./View.js"
import Frame from "../Frame/Frame.js"
import FrameProps from "../Frame/Props.js"
import Welcome from "../Component/Welcome/index.js"

describe("View", () => {
	it("should create empty instance", () => {
		const view = new View()
		assert.ok(view)
	})
	it("should print frame", () => {
		const view = new View()
		view.render(1)(["Hello"])
		assert.equal(String(view.frame), "Hello")
		const value = view.render(0)(["No output"])
		assert.deepStrictEqual({ ...value }, {
			imprint: "No output",
			value: [["No output"]],
			width: 144,
			height: 33,
			renderMethod: "visible",
			defaultProps: new FrameProps(),
		})
		view.render(() => (["fn result"]))(["Even with a function"])
		assert.equal(String(view.frame), "fn result")
		assert.deepStrictEqual(view.stdout.stream, [
			"Hello",
			"fn result"
		])
	})
	it("should print frame with render method set to append", () => {
		const view = new View({ renderMethod: View.RenderMethod.APPEND })
		view.render(1)(["Hello"])
		assert.equal(String(view.frame), "Hello" + " ".repeat(139))
		view.render(1)(["world"])
		assert.equal(String(view.frame), "world" + " ".repeat(139))
		const value = view.render(0)(["No output"])
		assert.deepStrictEqual({ ...value }, {
			imprint: "No output" + " ".repeat(144 - "No output".length),
			value: [["No output"]],
			width: 144,
			height: 33,
			renderMethod: View.RenderMethod.APPEND,
			defaultProps: new FrameProps(),
		})
		view.render(() => (["fn result"]))(["Even with a function"])
		assert.equal(String(view.frame), "fn result" + " ".repeat(144 - 9))
		assert.deepStrictEqual(view.stdout.stream, [
			"Hello",
			"world",
			"fn result"
		].map(
			row => row + " ".repeat(144 - row.length)
		))
	})
	it("should render Welcome component", () => {
		const view = new View({
			renderMethod: View.RenderMethod.APPEND,
			width: 144,
			height: 33,
		})
		view.register(Welcome)
		const frame = view.render("Welcome")({ user: { name: "View" } })
		assert.ok(frame instanceof Frame)
		const expected = [
			"Welcome View!",
			"What can we do today great?",
			"",
		].map(
			row => (row + " ".repeat(144 - row.length))
		).join("\n")
		assert.deepStrictEqual(view.stdout.stream, [expected])
	})
})
