import { App } from "@nan0web/ui"

/**
 * Abstract Scenario class to test app logic.
 * Scenarios run input commands and verify output.
 */
export default class Scenario {
	/** @type {App.Core.App} The app to run scenarios against */
	app

	/**
	 * Creates a new Scenario instance.
	 * @param {App.Core.App} app - App instance to run scenarios against
	 * @throws {TypeError} If app is not an App.Core.App instance
	 */
	constructor(app) {
		if (!(app instanceof App.Core.App)) {
			throw new TypeError("Scenario requires a App.Core.App instance")
		}
		this.app = app
	}

	/**
	 * Run scenario with input commands and expected output.
	 * @param {Array<any[]>} inputCommands - Array of command arrays
	 * @param {Array<any>} expectedOutputs - Expected outputs for each command
	 * @returns {Promise<boolean>} True if all outputs match expected
	 */
	async run(inputCommands, expectedOutputs) {
		const commandMessages = inputCommands.map(arr => App.Command.Message.parse(arr))
		const outputs = await this.app.processCommands(commandMessages)
		if (outputs.length !== expectedOutputs.length) return false
		for (let i = 0; i < outputs.length; i++) {
			if (JSON.stringify(outputs[i]) !== JSON.stringify(expectedOutputs[i])) {
				return false
			}
		}
		return true
	}
}