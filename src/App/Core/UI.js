import { Message } from "@nan0web/co"
import { notEmpty } from "@nan0web/types"
import View from "../../View/View.js"
import CoreApp from "./CoreApp.js"
import Widget from "./Widget.js"

/** @typedef {import("../../View/View.js").ComponentFn} ComponentFn */

/**
 * Abstract UI class to connect apps and widgets.
 * Supports input/output data typed classes and views.
 */
class UI extends Widget {
	/** @type {CoreApp} The app instance connected to this UI */
	app

	/**
	 * Creates a new UI instance.
	 * @param {CoreApp} app - The app to connect to this UI
	 * @param {View} [view] - View instance for rendering (default: new View())
	 */
	constructor(app, view = new View()) {
		super(view)
		this.app = app
	}

	/**
	 * Convert raw input to Message array.
	 * Must be implemented by subclasses.
	 * @param {any} rawInput - Raw input to convert
	 * @returns {Message[]} Array of command messages
	 * @throws {Error} Always thrown as this method must be implemented by subclasses
	 */
	convertInput(rawInput) {
		throw new Error("convertInput must be implemented by subclass")
	}

	/**
	 * Process input, run commands on app, and output results.
	 * Supports progress callback.
	 * @emits {start} Emitted when processing begins
	 * @emits {data} Emitted for each command being processed
	 * @emits {end} Emitted when all commands have been processed
	 * @param {any} rawInput - Raw input to process
	 * @returns {Promise<any[]>} Results of command processing
	 */
	async process(rawInput) {
		const commands = this.convertInput(rawInput).filter(notEmpty)
		const results = []
		let count = commands.length

		const proc = this.view.get("UIProcess")
		if (proc) {
			this.show(proc)
		}

		if (0 === count && this.app.selectCommand) {
			const answer = await this.app.selectCommand(this)
			if (answer) {
				const [input] = this.convertInput(rawInput)
				const cmd = new Message({
					argv: [answer],
					opts: input?.opts ?? {},
				})
				commands.push(cmd)
				++count
			} else {
				this.emit("end", { commands, results })
				return results
			}
		}
		this.emit("start", { commands })
		for (let i = 0; i < count; i++) {
			const command = commands[i]
			this.emit("data", { i, count, command })
			const result = await this.app.processCommand(command, this)
			results.push(result)
		}
		this.emit("end", { commands, results })
		// this.output(results)
		return results
	}

	/**
	 * Sets up event handlers for UI process events.
	 * @param {ComponentFn} UIProcess - Process view component
	 */
	show(UIProcess) {
		if (!UIProcess) return
		const onStart = () => {
			// this.view.render(UIProcess)
		}
		const onData = () => {

		}
		const onEnd = () => {

		}

		this.on("start", onStart)
		this.on("data", onData)
		this.on("end", onEnd)
	}

	/**
	 * Output results to the interface.
	 * @param {any[]} results - Results to output
	 */
	output(results) {
		results.forEach(result => {
			this.view.info(JSON.stringify(result))
		})
	}
}

export default UI
