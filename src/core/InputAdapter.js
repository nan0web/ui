import Event from "@nan0web/event/oop"
import InputMessage from "./Message/InputMessage.js"

/**
 * Abstract input adapter for UI implementations.
 *
 * @class InputAdapter
 * @extends Event
 */
class InputAdapter extends Event {
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
}

export default InputAdapter