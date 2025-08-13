import { describe, expect, it } from "vitest"
import View from "./View.js"
import Frame from "../Frame/Frame.js"
import FrameProps from "../Frame/Props.js"
import Welcome from "../Component/Welcome/index.js"

describe("View", () => {
	it("should create empty instance", () => {
		const view = new View()
		expect(view).toBeDefined()
	})
	it("should print frame", () => {
		const view = new View()
		view.render(1)(["Hello"])
		expect(String(view.frame)).toBe("Hello")
		const value = view.render(0)(["No output"])
		expect({ ...value }).toEqual({
			imprint: "No output",
			value: [["No output"]],
			width: 144,
			height: 33,
			renderMethod: "visible",
			defaultProps: new FrameProps(),
		})
		view.render(() => (["fn result"]))(["Even with a function"])
		expect(String(view.frame)).toBe("fn result")
		expect(view.stdout.stream).toEqual([
			"Hello",
			"fn result"
		])
	})
	it("should print frame with render method set to append", () => {
		const view = new View({ renderMethod: View.RenderMethod.APPEND })
		view.render(1)(["Hello"])
		expect(String(view.frame)).toBe("Hello" + " ".repeat(139))
		view.render(1)(["world"])
		expect(String(view.frame)).toBe("world" + " ".repeat(139))
		const value = view.render(0)(["No output"])
		expect({ ...value }).toEqual({
			imprint: "No output" + " ".repeat(144 - "No output".length),
			value: [["No output"]],
			width: 144,
			height: 33,
			renderMethod: View.RenderMethod.APPEND,
			defaultProps: new FrameProps(),
		})
		view.render(() => (["fn result"]))(["Even with a function"])
		expect(String(view.frame)).toBe("fn result" + " ".repeat(144 - 9))
		expect(view.stdout.stream).toEqual([
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
		expect(frame).toBeInstanceOf(Frame)
		const expected = [
			"Welcome View!",
			"What can we do today great?",
			"",
		].map(
			row => (row + " ".repeat(144 - row.length))
		).join("\n")
		expect(view.stdout.stream).toEqual([expected])
	})
})
