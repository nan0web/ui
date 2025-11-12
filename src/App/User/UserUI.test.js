import { describe, it } from "node:test"
import { strict as assert } from "node:assert"
import UserApp from "./UserApp.js"
import UserUI from "./UserUI.js"
import View from "../../View/View.js"
import InputMessage from "../../core/Message/InputMessage.js"
import Welcome from "../../Component/Welcome/index.js"

describe("UserUI", () => {
	it.skip("should convert input with user.name to commands", () => {
		// @todo there could not be args, opts in UI, it must be moved to UI-CLI
		const app = new UserApp()
		const view = new View()
		const ui = new UserUI(app, view)

		const commands = ui.convertInput("setUser --user Bob welcome")
		assert.equal(commands.length, 1)
		assert.equal(commands[0].args[0], "setUser")
		assert.equal(commands[0].args[1], "welcome")
		assert.equal(commands[0].opts.user, "Bob")
	})

	it.skip("should convert input without user.name to askUserName command", () => {
		const app = new UserApp()
		const view = new View()
		const ui = new UserUI(app, view)

		const commands = ui.convertInput("")
		assert.equal(commands.length, 1)
		// @todo there could not be args, opts in UI, it must be moved to UI-CLI
		assert.equal(commands[0].args.length, 0)
		assert.equal(commands[0].opts.user, "")
	})

	it.skip("should process askUserName command interactively", async () => {
		// @todo there could not be args, opts in UI, it must be moved to UI-CLI
		const app = new UserApp()
		const view = new View()
		const ui = new UserUI(app, view)
		view.register("Welcome", Welcome)

		// Mock view.ask to return a name
		view.ask = (input) => Promise.resolve(new InputMessage("Charlie"))
		// Mock output to collect outputs
		const outputs = []
		ui.output = (results) => outputs.push(...results)

		const results = await ui.process(["welcome"])
		assert.ok(view.ask)
		assert.equal(results.length, 1)
		assert.ok(results[0].value[0][0].includes("Welcome"))
		assert.ok(view.stdout.stream[0].includes("Welcome Charlie!"))
	})
})
