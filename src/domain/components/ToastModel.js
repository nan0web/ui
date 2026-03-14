import { resolveDefaults } from '@nan0web/types'

/**
 * @typedef {'success'|'error'|'info'|'warning'} ToastVariant
 * @typedef {Object} ToastData
 * @property {string} [message]
 * @property {ToastVariant} [variant]
 * @property {number} [duration]
 * @property {boolean} [open]
 */

/**
 * Model-as-Schema for Toast notification component.
 * Represents a transient message displayed to the user.
 */
export class ToastModel {
	// ==========================================
	// 1. MODEL AS SCHEMA (Static Definition)
	// ==========================================

	static message = {
		help: 'The message content of the toast',
		default: 'Saved successfully!',
		type: 'string',
	}

	static variant = {
		help: 'Visual styling representing the message severity',
		default: 'success',
		options: ['success', 'error', 'info', 'warning'],
	}

	static duration = {
		help: 'Time in ms before auto-dismissal. 0 to keep open indefinitely.',
		default: 3000,
		type: 'number',
	}

	static open = {
		help: 'Controls visibility state',
		default: true,
		type: 'boolean',
	}

	/** @type {string|undefined} */ message = undefined;
	/** @type {ToastVariant|undefined} */ variant = undefined;
	/** @type {number|undefined} */ duration = undefined;
	/** @type {boolean|undefined} */ open = undefined;

	/**
	 * @param {ToastData} [data]
	 */
	constructor(data = {}) {
		Object.assign(this, resolveDefaults(ToastModel, data))
	}

	// ==========================================
	// 2. AGNOSTIC LOGIC (Async Generator)
	// ==========================================

	async *run() {
		// Maps naturally to the 'log' intent for OLMUI runners.
		yield {
			type: 'log',
			level: this.variant === 'error' ? 'error' : this.variant === 'warning' ? 'warn' : 'info',
			message: this.message,
			component: 'Toast', // Hint for specific UI visual rendering
			model: /** @type {any} */ (this),
		}

		// Wait exactly 'duration' ms before completing (unless duration is 0)
		if (this.duration && this.duration > 0) {
			await new Promise((resolve) => setTimeout(resolve, this.duration))
		}

		return { type: 'result', data: { closed: true } }
	}
}
