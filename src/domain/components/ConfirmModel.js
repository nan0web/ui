import { Model } from '@nan0web/core'

/**
 * @typedef {Object} ConfirmData
 * @property {string} [message]
 * @property {string} [confirmText]
 * @property {string} [cancelText]
 */

/**
 * Model-as-Schema for Confirm component.
 */
export class ConfirmModel extends Model {
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

	/**
	 * @param {ConfirmData | any} [data]
	 */
	constructor(data = {}) {
		super(data)
		/** @type {string|undefined} */ this.message
		/** @type {string|undefined} */ this.confirmText
		/** @type {string|undefined} */ this.cancelText
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
