import { resolveDefaults } from '@nan0web/types'

/**
 * @typedef {Object} SelectData
 * @property {string} [content]
 * @property {string[]} [options]
 */

/**
 * Model-as-Schema for Select component.
 * Represents a dropdown choice selection.
 */
export class SelectModel {
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

	/** @type {string|undefined} */ content = undefined;
	/** @type {string[]|undefined} */ options = undefined;

	/**
	 * @param {SelectData} [data]
	 */
	constructor(data = {}) {
		Object.assign(this, resolveDefaults(SelectModel, data))
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
