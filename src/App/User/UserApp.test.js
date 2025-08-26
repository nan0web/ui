import { describe, it } from "node:test"
import { strict as assert } from "node:assert"
import UserApp from "./UserApp.js"
import View from "../../View/View.js"
import UserUI from "./UserUI.js"
import Command from "./Command/index.js"

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
		const cmd = Command.Message.parse("setUser -user Alice")
		const result = await app.processCommand(cmd, ui)
		assert.equal(String(result), "Welcome Alice")
	})

	it("should welcome with user", async () => {
		app = new UserApp()
		view = new View()
		view.register("Welcome", (input) => {
			return ["Welcome " + input.user.name]
		})
		ui = new UserUI(app, view)
		const cmd = Command.Message.parse("welcome -user YaRa")
		const result = await app.processCommand(cmd, ui)
		assert.equal(String(result), "Welcome YaRa")
	})

	it("should ask for a user name and welcome with user", async () => {
		app = new UserApp()
		view = new View()
		view.register("Welcome", (input) => {
			return ["Welcome " + input.user.name]
		})
		ui = new UserUI(app, view)
		const cmd = Command.Message.parse("welcome")
		setTimeout(() => { view.stdin.write("Alice") }, 33)
		const result = await app.processCommand(cmd, ui)
		assert.equal(String(result), "Welcome Alice")
	})
})
