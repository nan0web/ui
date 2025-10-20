import UIMessage from "./Message.js"

/**
 * Вхідне повідомлення з даними користувача
 */
export default class InputMessage extends UIMessage {
	/**
	 * @param {Object} input - Властивості вхідного повідомлення
	 * @param {string} [input.body=""]
	 * @param {string} [input.type=""]
	 * @param {string} [input.id=""]
	 * @param {string} [input.value=""] - Значення, що ввів користувач
	 * @param {boolean} [input.waiting=false] - Чи очікуємо відповіді
	 * @param {Array<string>} [input.options=[]] - Доступні варіанти вибору
	 */
	constructor(input = {}) {
		super(input)
		const {
			value = "",
			waiting = false,
			options = [],
		} = input

		this.value = String(value)
		this.waiting = Boolean(waiting)
		this.options = Array.isArray(options) ? options : [String(options)]
	}

	get empty() {
		return this.value === null || this.value.length === 0
	}

	get isValid() {
		return !this.empty
	}

	static from(input) {
		if (input instanceof InputMessage) return input
		return new InputMessage(input)
	}
}
