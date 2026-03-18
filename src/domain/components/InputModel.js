import { Model } from '@nan0web/core'

/**
 * @typedef {'text'|'email'|'password'|'number'|'tel'|'url'|'date'} InputType
 * @typedef {Object} InputData
 * @property {InputType} [type]
 * @property {string} [label]
 * @property {string} [placeholder]
 * @property {boolean} [required]
 * @property {string} [pattern]
 * @property {string} [min]
 * @property {string} [max]
 * @property {string} [step]
 * @property {string} [hint]
 * @property {boolean} [disabled]
 * @property {string} [content]
 */

/**
 * Model-as-Schema for Input component.
 * Used exclusively for schema definition, validation, and editor reflection.
 */
export class InputModel extends Model {
	// ==========================================
	// 1. MODEL AS SCHEMA (Static Definition)
	// ==========================================

	static type = {
		help: 'HTML5 Input type attribute',
		default: 'text',
		options: ['text', 'email', 'password', 'number', 'tel', 'url', 'date'],
	}

	static label = {
		help: 'Label displayed above the input',
		default: '',
		type: 'string',
	}

	static placeholder = {
		help: 'Placeholder text shown when empty',
		default: '',
		type: 'string',
	}

	static required = {
		help: 'Whether the field must be filled out',
		default: false,
		type: 'boolean',
	}

	static pattern = {
		help: 'RegExp pattern for validation (e.g. [A-Z]{3})',
		default: '',
		type: 'string',
	}

	static min = {
		help: 'Minimum value (for number/date types)',
		default: '',
		type: 'string',
	}

	static max = {
		help: 'Maximum value (for number/date types)',
		default: '',
		type: 'string',
	}

	static step = {
		help: 'Step interval (for number/date types)',
		default: '',
		type: 'string',
	}

	static hint = {
		help: 'Helper text displayed below the input',
		default: '',
		type: 'string',
	}

	static disabled = {
		help: 'Whether the input is greyed out and uneditable',
		default: false,
		type: 'boolean',
	}

	static content = {
		help: 'The actual value of the input',
		default: '',
		type: 'string',
	}

	/**
	 * @param {InputData | any} [data]
	 */
	constructor(data = {}) {
		super(data)
		/** @type {InputType|undefined} */ this.type
		/** @type {string|undefined} */ this.label
		/** @type {string|undefined} */ this.placeholder
		/** @type {boolean|undefined} */ this.required
		/** @type {string|undefined} */ this.pattern
		/** @type {string|undefined} */ this.min
		/** @type {string|undefined} */ this.max
		/** @type {string|undefined} */ this.step
		/** @type {string|undefined} */ this.hint
		/** @type {boolean|undefined} */ this.disabled
		/** @type {string|undefined} */ this.content
	}

	// ==========================================
	// 2. AGNOSTIC LOGIC (Async Generator)
	// ==========================================

	async *run() {
		const response = yield {
			type: 'ask',
			field: 'content',
			schema: {
				help: this.label || this.placeholder || 'Enter value',
				validate: (val) => {
					if (this.required && !val) return 'This field is required'
					if (this.pattern && val) {
						try {
							const re = new RegExp(`^${this.pattern}$`)
							if (!re.test(val)) return 'Invalid format'
						} catch (e) {
							// fallback if pattern is malformed
						}
					}
					return true
				},
			},
			component: 'Input',
			model: /** @type {any} */ (this),
		}

		this.content = response.value
		return { type: 'result', data: { value: this.content } }
	}
}
