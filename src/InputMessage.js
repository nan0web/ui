import { notEmpty } from "@nan0web/types"

/**
 * Represents a message input with value, options, and metadata.
 */
class InputMessage {
	/** @type {string | null} Input value */
	value

	/** @type {string[]} Available options for this input */
	options

	/** @type {boolean} Whether this input is waiting for response */
	waiting

	/** @type {number} Timestamp when input was created */
	#time

	/**
	 * Creates a new InputMessage instance.
	 * @param {object} props - Input message properties
	 * @param {string | null} [props.value=""] - Input value
	 * @param {string[]} [props.options=[]] - Available options
	 * @param {boolean} [props.waiting=false] - Waiting state flag
	 */
	constructor(props = {}) {
		if ("string" === typeof props) {
			props = { value: props }
		}
		const {
			value = "",
			waiting = false,
			options = [],
		} = props
		this.#time = Date.now()
		this.waiting = Boolean(waiting)

		this.options = options.map(String)
		this.value = String(value)
	}

	/**
	 * Checks if the input value is empty.
	 * @returns {boolean} True if value is empty or null, false otherwise
	 */
	get empty() {
		return null === this.value || 0 === this.value.length
	}

	/**
	 * Gets the timestamp when input was created.
	 * @returns {number} Creation timestamp
	 */
	get time() {
		return this.#time
	}

	/**
	 * Checks if the input is an escape sequence.
	 * @returns {boolean} True if input value is escape sequence, false otherwise
	 */
	get escaped() {
		return String.fromCharCode(27) + "\n" === this.value
	}

	/**
	 * Validates if the input has a non-empty value.
	 * @returns {boolean} True if input is valid, false otherwise
	 */
	isValid() {
		return notEmpty(this.value)
	}

	/**
	 * Converts the input to a plain object representation.
	 * @returns {object} Object with all properties including timestamp
	 */
	toObject() {
		return { ...this, time: this.time }
	}

	/**
	 * Converts the input to a string representation including timestamp.
	 * @returns {string} String representation with timestamp and value
	 */
	toString() {
		const date = new Date(this.time)
		return `${date.toISOString().split(".")[0]} ${this.value}`
	}

	/**
	 * Creates an InputMessage instance from the given value.
	 * @param {InputMessage|object|string} value - The value to create from
	 * @returns {InputMessage} An InputMessage instance
	 */
	static from(value) {
		if (value instanceof InputMessage) return value
		return new this(value)
	}
}

export default InputMessage
