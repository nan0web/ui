import UIMessage from "./Message.js"

/**
 * OutputMessage – message sent from the system to the UI.
 *
 * @class OutputMessage
 * @extends UIMessage
 */
export default class OutputMessage extends UIMessage {
	static PRIORITY = {
		LOW: 0,
		NORMAL: 1,
		HIGH: 2,
		CRITICAL: 3
	}

	/** @type {string[]} */
	body
	/** @type {Object} */
	meta = {}
	/** @type {Error|null} */
	error = null
	/** @type {number} */
	priority = OutputMessage.PRIORITY.NORMAL

	/**
	 * Creates an OutputMessage.
	 *
	 * @param {Object} [input={}] - Message properties.
	 */
	constructor(input = {}) {
		super(input)

		const {
			content = [],
			body = [],
			meta = {},
			error = null,
			priority = OutputMessage.PRIORITY.NORMAL
		} = input

		const contentSource = 'body' in input ? body :
			'content' in input ? content : []

		this.body = Array.isArray(contentSource) ?
			contentSource :
			(contentSource ? [String(contentSource)] : [])

		this.meta = meta
		this.error = error instanceof Error ? error :
			error ? new Error(String(error)) : null
		this.priority = Number(priority)

		if (!this.type && this.error) {
			this.type = UIMessage.TYPES.ERROR
		} else if (!this.type) {
			this.type = UIMessage.TYPES.INFO
		}
	}

	/** @returns {string[]} */
	get content() {
		return this.body
	}
	/** @param {string[]|string} value */
	set content(value) {
		this.body = Array.isArray(value) ? value : [String(value)]
	}
	/** @returns {number} */
	get size() {
		return this.content.length
	}
	/** @returns {boolean} */
	get isError() {
		return this.error !== null || this.type === UIMessage.TYPES.ERROR
	}
	/** @returns {boolean} */
	get isInfo() {
		return this.type === UIMessage.TYPES.INFO || this.type === UIMessage.TYPES.SUCCESS
	}

	/**
	 * Combines multiple messages into a new one.
	 *
	 * @param {...OutputMessage} messages - Messages to combine.
	 * @returns {OutputMessage}
	 */
	combine(...messages) {
		const combinedContent = [...this.content]
		let combinedMeta = { ...this.meta }
		let combinedError = this.error
		let combinedPriority = this.priority

		messages.forEach(msg => {
			if (msg instanceof OutputMessage) {
				combinedContent.push(...msg.content)
				combinedMeta = { ...combinedMeta, ...msg.meta }
				if (msg.error) combinedError = msg.error
				combinedPriority = Math.max(combinedPriority, msg.priority)
			}
		})

		return new OutputMessage({
			content: combinedContent,
			meta: combinedMeta,
			error: combinedError,
			priority: combinedPriority,
			type: this.type
		})
	}

	/**
	 * Serialises the message to a plain JSON object.
	 *
	 * @returns {Object}
	 */
	toJSON() {
		return {
			body: this.body,
			content: this.content,
			meta: this.meta,
			type: this.type,
			id: this.id,
			time: this.time.toISOString(),
			error: this.error ? {
				message: this.error.message,
				stack: this.error.stack
			} : null,
			priority: this.priority
		}
	}

	/**
	 * Creates an OutputMessage from plain input.
	 *
	 * @param {Object} input - Message data.
	 * @returns {OutputMessage}
	 */
	static from(input) {
		if (input instanceof OutputMessage) return input
		return new OutputMessage(input)
	}
}
