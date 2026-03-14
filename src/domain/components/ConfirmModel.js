import { resolveDefaults } from '@nan0web/types'

/**
 * @typedef {Object} ConfirmData
 * @property {string} [message]
 * @property {string} [confirmText]
 * @property {string} [cancelText]
 */

/**
 * Model-as-Schema for Confirm component.
 */
export class ConfirmModel {
	// ==========================================
	// 1. MODEL AS SCHEMA (Static Definition)
	// ==========================================

	static message = {
		help: 'Dialog message displayed to the user',
		default: 'Are you sure?',
		type: 'string',
	}

	static confirmText = {
		help: 'Label for the positive confirmation button',
		default: 'Yes',
		type: 'string',
	}

	static cancelText = {
		help: 'Label for the negative rejection button',
		default: 'No',
		type: 'string',
	}

	/** @type {string|undefined} */ message = undefined;
	/** @type {string|undefined} */ confirmText = undefined;
	/** @type {string|undefined} */ cancelText = undefined;

	/**
	 * @param {ConfirmData} [data]
	 */
	constructor(data = {}) {
		Object.assign(this, resolveDefaults(ConfirmModel, data))
	}

	// ==========================================
	// 2. AGNOSTIC LOGIC (Async Generator)
	// ==========================================

	async *run() {
		const response = yield {
			type: 'ask',
			field: 'confirmed',
			schema: {
				help: this.message,
				type: 'boolean',
			},
			component: 'Confirm',
			model: /** @type {any} */ (this), // Attached for richer UI metadata
		}

		return { type: 'result', data: { confirmed: !!response.value } }
	}
}
