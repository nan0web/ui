import NanoEvent from "@yaro.page/nano-events"
import InputMessage from "./InputMessage.js"

/**
 * @typedef {Object} Processor
 * @property {Function} on - Event handler registration
 */

class Processor extends NanoEvent { }

/**
 * Handles standard input stream with message buffering.
 */
class StdIn extends NanoEvent {
	/** @type {number} Read interval in milliseconds */
	static READ_INTERVAL = 99
	
	/** @type {string[]} Messages to ignore */
	static IGNORE_MESSAGES = ["", undefined]
	
	/** @type {InputMessage[]} Input message buffer */
	stream = []
	
	/** @type {Processor} Input processor */
	processor
	
	/**
	 * Creates a new StdIn instance.
	 * @param {object} props - StdIn properties
	 * @param {Processor} [props.processor] - Input processor
	 * @param {InputMessage[]} [props.stream=[]] - Initial input stream
	 */
	constructor(props = {}) {
		super()
		const {
			processor = new Processor(),
			stream = [],
		} = props
		this.processor = processor
		this.stream = stream
		this.processor?.on("data", (data) => {
			this.write(data)
		})
	}

	/**
	 * Checks if there are messages waiting in the input stream.
	 * @returns {boolean} True if waiting messages, false otherwise
	 */
	get waiting() {
		return this.stream.length
	}
	
	/**
	 * Checks if the input stream has ended (no messages left).
	 * @returns {boolean} True if no messages left, false otherwise
	 */
	get ended() {
		return 0 === this.stream.length
	}

	/**
	 * Reads a message from the input stream.
	 * Waits until messages are available if stream is empty.
	 * @returns {Promise<InputMessage>} Next input message
	 */
	async read() {
		while (this.ended) {
			await new Promise(resolve => setTimeout(resolve, StdIn.READ_INTERVAL))
		}
		return this.stream.shift()
	}
	
	/**
	 * Writes a message to the input stream.
	 * @param {string} message - Message to write
	 * @returns {boolean} True if message accepted, False if ignored
	 */
	write(message) {
		// this.processor?.emit("data", message)
		const text = String(message)
		if (StdIn.IGNORE_MESSAGES.includes(text)) {
			return false
		}
		this.stream.push(this.decode(text))
		return true
	}
	
	/**
	 * Decodes a message into an InputMessage instance.
	 * @param {InputMessage | string[] | any} message - Message to decode
	 * @returns {InputMessage} Decoded input message
	 */
	decode(message) {
		if (message instanceof InputMessage) return message
		if (Array.isArray(message) && message.every(typeOf(String))) {
			return CommandMessage.parse(message)
		}
		return new InputMessage(message)
	}
	
	/**
	 * Creates a StdIn instance from the given input.
	 * @param {StdIn|object} input - The input to create from
	 * @returns {StdIn} A StdIn instance
	 */
	static from(input) {
		if (input instanceof StdIn) return input
		return new this(input)
	}
}

export default StdIn