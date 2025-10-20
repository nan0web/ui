import EventProcessor from "@nan0web/event/oop"
import View from "../../View/View.js"
import InputMessage from "../../core/Message/InputMessage.js"
import { StreamEntry } from "@nan0web/db"

/** @typedef {import("./UI.js").ComponentFn} ComponentFn */

/**
 * Abstract Widget class.
 * Widget is a view with ability to input data in a specific format.
 * Input and output data are typed classes.
 */
class Widget extends EventProcessor {
	/** @type {View} The view associated with this widget */
	view

	/**
	 * Creates a new Widget instance.
	 * @param {View} [view] - View instance (default: new View())
	 */
	constructor(view = new View()) {
		super()
		this.view = view
	}

	/**
	 * Ask user for input data of specific class.
	 * @param {InputMessage} input - instance of InputMessage or similar
	 * @returns {Promise<InputMessage | null>} instance of InputMessage or null
	 */
	async ask(input) {
		return await this.view.ask(input)
	}

	/**
	 * @param {AsyncGenerator<StreamEntry>} stream
	 * @returns {Promise<void>}
	 */
	async read(stream) {
		for await (const entry of stream) {
			this.view.progress(true)(entry)
		}
	}

	/**
	 * Render output data using a view function.
	 * @param {Function|string} viewFnOrName - View function or registered view name
	 * @param {object} outputData - Typed output data instance
	 * @returns {any} Rendered output
	 * @throws {Error} If view component is not found when using string name
	 */
	render(viewFnOrName, outputData) {
		/** @type {Function | ComponentFn | undefined} */
		const viewFn = typeof viewFnOrName === "string"
			? this.view.get(viewFnOrName)
			: viewFnOrName

		if (!viewFn) {
			throw new Error([
				"View component not found", ": ", viewFnOrName
			].join(""))
		}
		return this.view.render(viewFn)(outputData)
	}
}

export default Widget
