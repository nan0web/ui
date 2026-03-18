import { Model } from '@nan0web/core'

/**
 * @typedef {Object} SelectData
 * @property {string} [content]
 * @property {string[]} [options]
 */

/**
 * Model-as-Schema for Select component.
 * Represents a dropdown choice selection.
 */
export class SelectModel extends Model {
	// ==========================================
	// 1. MODEL AS SCHEMA (Static Definition)
	// ==========================================

	static content = {
		help: 'Currently selected item or default placeholder',
		default: 'Choose option',
		type: 'string',
	}

	static options = {
		help: 'List of available options for selection',
		default: ['Alpha', 'Beta', 'Gamma'],
		type: 'string[]',
	}

	/**
	 * @param {SelectData | any} [data]
	 */
	constructor(data = {}) {
		super(data)
		/** @type {string|undefined} */ this.content
		/** @type {string[]|undefined} */ this.options
	}

	// ==========================================
	// 2. AGNOSTIC LOGIC (Async Generator)
	// ==========================================

	async *run() {
		const response = yield {
			type: 'ask',
			field: 'content',
			schema: {
				help: 'Select an option',
				options: this.options,
				validate: (val) => this.options?.includes(val) || 'Invalid option selected',
			},
			component: 'Select',
			model: /** @type {any} */ (this),
		}

		this.content = response.value
		return { type: 'result', data: { selected: this.content } }
	}
}
