import { Model } from '@nan0web/core'

/**
 * @typedef {Object} AutocompleteData
 * @property {string} [content]
 * @property {string[]} [options]
 */

/**
 * Model-as-Schema for Autocomplete component.
 * Represents a text input with search suggestions.
 */
export class AutocompleteModel extends Model {
	// ==========================================
	// 1. MODEL AS SCHEMA (Static Definition)
	// ==========================================

	static content = {
		help: 'Current search text',
		default: '',
		type: 'string',
	}

	static options = {
		help: 'List of suggestions based on input',
		default: [],
		type: 'string[]',
	}

	/**
	 * @param {AutocompleteData | any} [data]
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
				help: 'Search or enter text',
				options: this.options,
			},
			component: 'Autocomplete',
			model: /** @type {any} */ (this),
		}

		this.content = response.value
		return { type: 'result', data: { selected: this.content } }
	}
}
