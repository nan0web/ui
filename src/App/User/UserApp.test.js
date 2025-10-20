import { describe, it } from "node:test"
import { strict as assert } from "node:assert"
import UserApp from "./UserApp.js"
import View from "../../View/View.js"
import UserUI from "./UserUI.js"
import Command from "./Command/index.js"
import Frame from "../../Frame/Frame.js"

describe("UserApp", () => {
	/** @type {UserApp} */
	let app
	/** @type {View} */
	let view
	/** @type {UserUI} */
	let ui

	it("should set user and welcome", async () => {
		app = new UserApp()
		view = new View()
		view.register("Welcome", (input) => {
			return ["Welcome " + input.user.name]
		})
		ui = new UserUI(app, view)
		const cmd = Command.Message.parse("setUser --user Alice")
		const result = await app.processCommand(cmd, ui)
		assert.equal(String(result.message), Frame.CLEAR_LINE + "\r" + "Welcome Alice")
	})

	it("should welcome with user", async () => {
		app = new UserApp()
		view = new View()
		view.register("Welcome", (input) => {
			return ["Welcome " + input.user.name]
		})
		ui = new UserUI(app, view)
		const cmd = Command.Message.parse("welcome --user YaRa")
		const result = await app.processCommand(cmd, ui)
		assert.equal(String(result), Frame.CLEAR_LINE + "\r" + "Welcome YaRa")
	})

	it("should ask for a user name and welcome with user", async () => {
		app = new UserApp()
		view = new View()
		view.register("Welcome", (input) => {
			return ["Welcome " + input.user.name]
		})
		ui = new UserUI(app, view)
		const cmd = Command.Message.parse("welcome")

		// Mock the stdin to provide input immediately
		view.stdin.write("Alice\n")

		const result = await app.processCommand(cmd, ui)
		assert.equal(String(result), Frame.CLEAR_LINE + "\r" + "Welcome Alice\n")
	})
})
