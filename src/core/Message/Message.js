import { Message as BaseMessage } from "@nan0web/co"

/**
 * Base UI message class.
 *
 * @class UIMessage
 * @extends BaseMessage
 */
class UIMessage extends BaseMessage {
	static TYPES = {
		TEXT: 'text',
		FORM: 'form',
		PROGRESS: 'progress',
		ERROR: 'error',
		INFO: 'info',
		SUCCESS: 'success',
		WARNING: 'warning',
		COMMAND: 'command',
		NAVIGATION: 'navigation'
	}

	/** @type {string} */
	type = ""
	/** @type {string} */
	id = ""

	/**
	 * Creates a UIMessage.
	 *
	 * @param {Object} [input={}] - Message properties.
	 */
	constructor(input = {}) {
		super(input)

		const {
			type = this.type,
			id = this.id,
		} = input
		this.id = id || `ui-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
		this.type = String(type)

		if (!('body' in input) && 'content' in input) {
			this.body = Array.isArray(input.content) ? input.content : [input.content]
		}
	}

	/**
	 * Creates a UIMessage instance from plain data.
	 *
	 * @param {Object} data - Message data.
	 * @returns {UIMessage}
	 */
	static from(data) {
		if (data instanceof UIMessage) return data
		return new this(data)
	}

	/**
	 * Checks if the message type is valid.
	 *
	 * @returns {boolean}
	 */
	isValidType() {
		return Object.values(UIMessage.TYPES).includes(this.type)
	}

	/**
	 * Checks whether the message contains any body content.
	 *
	 * @returns {boolean}
	 */
	isEmpty() {
		return !this.body || this.body.length === 0
	}
}

export default UIMessage