import { notEmpty } from "@nan0web/types"
import { Message } from "@nan0web/co"

/** @typedef {Message | string | null} InputMessageValue */

/**
 * Represents a message input with value, options, and metadata.
 */
export default class InputMessage {
	static ESCAPE = String.fromCharCode(27)
	/** @type {InputMessageValue} Input value */
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
	 * @param {InputMessageValue} [props.value=""] - Input value
	 * @param {string[]|string} [props.options=[]] - Available options
	 * @param {boolean} [props.waiting=false] - Waiting state flag
	 * @param {boolean} [props.escaped=false] - Sets value to escape when true
	 */
	constructor(props = {}) {
		if ("string" === typeof props) {
			props = { value: props }
		}
		const {
			value = "",
			waiting = false,
			options = [],
			escaped = false,
		} = props
		this.#time = Date.now()
		this.waiting = Boolean(waiting)

		// Properly handle string options by converting to array
		this.options = Array.isArray(options) ? options.map(String) : [String(options)]
		this.value = String(value)
		if (!this.value && escaped) {
			this.value = this.ESCAPE
		}
	}

	/**
	 * Checks if the input value is empty.
	 * @returns {boolean} True if value is empty or null, false otherwise
	 */
	get empty() {
		return null === this.value || 0 === String(this.value).length
	}

	/**
	 * Gets the timestamp when input was created.
	 * @returns {number} Creation timestamp
	 */
	get time() {
		return this.#time
	}

	/**
	 * Returns the escape value.
	 * @returns {string}
	 */
	get ESCAPE() {
		return /** @type {typeof InputMessage} */ (this.constructor).ESCAPE
	}

	/**
	 * Checks if the input is an escape sequence.
	 * @returns {boolean} True if input value is escape sequence, false otherwise
	 */
	get escaped() {
		return this.ESCAPE === this.value
	}

	/**
	 * Validates if the input has a non-empty value.
	 * @returns {boolean} True if input is valid, false otherwise
	 */
	get isValid() {
		// An input is valid only if it has a non-empty value and is not an escape sequence
		return notEmpty(this.value) && this.value !== this.ESCAPE
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
