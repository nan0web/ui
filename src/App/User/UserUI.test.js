import { describe, it, expect, vi } from "vitest"
import UserApp from "./UserApp.js"
import UserUI from "./UserUI.js"
import View from "../../View/View.js"
import InputMessage from "../../InputMessage.js"
import Welcome from "../../Component/Welcome/index.js"

describe("UserUI", () => {
	it("should convert input with user.name to commands", () => {
		const app = new UserApp()
		const view = new View()
		const ui = new UserUI(app, view)

		const commands = ui.convertInput("setUser -user Bob welcome")
		expect(commands.length).toBe(1)
		expect(commands[0].args.get(0)).toBe("setUser")
		expect(commands[0].args.get(1)).toBe("welcome")
		expect(commands[0].opts.user).toBe("Bob")
	})

	it("should convert input without user.name to askUserName command", () => {
		const app = new UserApp()
		const view = new View()
		const ui = new UserUI(app, view)

		const commands = ui.convertInput({})
		expect(commands.length).toBe(1)
		expect(String(commands[0])).toBe("<no options> <empty args>")
	})

	it("should process askUserName command interactively", async () => {
		const app = new UserApp()
		const view = new View()
		const ui = new UserUI(app, view)
		view.register("Welcome", Welcome)

		// Mock view.ask to return a name
		view.ask = vi.fn().mockResolvedValue(new InputMessage("Charlie"))
		// Mock output to collect outputs
		const outputs = []
		ui.output = (results) => outputs.push(...results)

		const results = await ui.process(["welcome"])
		expect(view.ask).toHaveBeenCalled()
		expect(results.length).toBe(1)
		expect(results[0].value[0][0]).toBe("Welcome")
		expect(view.stdout.stream[0]).toContain("Welcome Charlie!")
	})
})
