import { resolveDefaults } from '@nan0web/types'

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
export class InputModel {
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

	/** @type {InputType|undefined} */ type = undefined;
	/** @type {string|undefined} */ label = undefined;
	/** @type {string|undefined} */ placeholder = undefined;
	/** @type {boolean|undefined} */ required = undefined;
	/** @type {string|undefined} */ pattern = undefined;
	/** @type {string|undefined} */ min = undefined;
	/** @type {string|undefined} */ max = undefined;
	/** @type {string|undefined} */ step = undefined;
	/** @type {string|undefined} */ hint = undefined;
	/** @type {boolean|undefined} */ disabled = undefined;
	/** @type {string|undefined} */ content = undefined;

	/**
	 * @param {InputData} [data]
	 */
	constructor(data = {}) {
		Object.assign(this, resolveDefaults(InputModel, data))
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
