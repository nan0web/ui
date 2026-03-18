import { Model } from '@nan0web/core'

/**
 * @typedef {'sm'|'md'|'lg'} SpinnerSize
 * @typedef {Object} SpinnerData
 * @property {SpinnerSize} [size]
 * @property {string} [color]
 */

/**
 * Model-as-Schema for Spinner component.
 * Represents a loading or progress state without user interaction.
 */
export class SpinnerModel extends Model {
	// ==========================================
	// 1. MODEL AS SCHEMA (Static Definition)
	// ==========================================

	static size = {
		help: 'Spinner diameter',
		default: 'md',
		options: ['sm', 'md', 'lg'],
	}

	static color = {
		help: 'Override for base color token',
		type: 'color',
		default: '',
	}

	/**
	 * @param {SpinnerData | any} [data]
	 */
	constructor(data = {}) {
		super(data)
		/** @type {SpinnerSize|undefined} */ this.size
		/** @type {string|undefined} */ this.color
	}

	// ==========================================
	// 2. AGNOSTIC LOGIC (Async Generator)
	// ==========================================

	async *run() {
		// A spinner does not ask for anything, it simply indicates progress.
		// However, as a pure component it doesn't do any work itself,
		// so running it just means declaring its state.
		yield {
			type: 'progress',
			message: 'Loading...',
			component: 'Spinner',
			model: /** @type {any} */ (this),
		}

		// Instant exit since it performs no async task internally
		return { type: 'result', data: { completed: true } }
	}
}
