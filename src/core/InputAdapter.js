import Event from "@nan0web/event/oop"
import InputMessage from "./Message/InputMessage.js"
import CancelError from "./Error/CancelError.js"

/**
 * Abstract input adapter for UI implementations.
 *
 * @class InputAdapter
 * @extends Event
 */
export default class InputAdapter extends Event {
	static CancelError = CancelError
	/** @returns {typeof CancelError} */
	get CancelError() {
		return /** @type {typeof InputAdapter} */ (this.constructor).CancelError
	}
	/**
	 * Starts listening for input and emits an `input` event.
	 *
	 * @returns {void}
	 */
	start() {
		this.emit('input',
			InputMessage.from({ value: "Adapter started" })
		)
	}

	/**
	 * Stops listening for input. Default implementation does nothing.
	 *
	 * @returns {void}
	 */
	stop() {
		// Default implementation – does nothing
	}

	/**
	 * Checks whether the adapter is ready to receive input.
	 *
	 * @returns {boolean} Always true in base class.
	 */
	isReady() {
		return true
	}

	/**
	 * Helper to ask a question.
	 * @param {string} question - Question to ask.
	 * @returns {Promise<string>}
	 */
	async ask(question) {
		throw new Error('ask() method must be implemented in subclass')
	}

	/**
	 * Generic selection prompt.
	 * @param {Object} config - Selection configuration.
	 * @returns {Promise<{ index: number, value: string | null }>}
	 */
	async select(config) {
		throw new Error('select() method must be implemented in subclass')
	}
}
