import { Model } from '@nan0web/core'

/**
 * @typedef {'primary'|'secondary'|'info'|'ok'|'warn'|'err'|'ghost'} ButtonVariant
 * @typedef {'sm'|'md'|'lg'} ButtonSize
 * @typedef {Object} ButtonData
 * @property {string} [content]
 * @property {ButtonVariant} [variant]
 * @property {ButtonSize} [size]
 * @property {boolean} [outline]
 * @property {boolean} [disabled]
 * @property {boolean} [loading]
 */

/**
 * Model-as-Schema for Button component.
 * Represents the intention and state of a Button interaction.
 * Used exclusively for schema definition and editor validation.
 */
export class ButtonModel extends Model {
	// ==========================================
	// 1. MODEL AS SCHEMA (Static Definition)
	// ==========================================

	static content = {
		help: 'Text or content inside the button',
		default: 'Click Me',
		type: 'string',
	}

	static variant = {
		help: 'Visual importance and semantic meaning',
		default: 'primary',
		options: ['primary', 'secondary', 'info', 'ok', 'warn', 'err', 'ghost'],
	}

	static size = {
		help: 'Size of the button',
		default: 'md',
		options: ['sm', 'md', 'lg'],
	}

	static outline = {
		help: 'Whether the button has a transparent background with border',
		default: false,
		type: 'boolean',
	}

	static disabled = {
		help: 'Whether the button is disabled and unclickable',
		default: false,
		type: 'boolean',
	}

	static loading = {
		help: 'Whether the button shows a loading spinner instead of content',
		default: false,
		type: 'boolean',
	}

	/**
	 * @param {ButtonData | any} [data]
	 */
	constructor(data = {}) {
		super(data)
		/** @type {string|undefined} */ this.content
		/** @type {ButtonVariant|undefined} */ this.variant
		/** @type {ButtonSize|undefined} */ this.size
		/** @type {boolean|undefined} */ this.outline
		/** @type {boolean|undefined} */ this.disabled
		/** @type {boolean|undefined} */ this.loading
	}

	// ==========================================
	// 2. AGNOSTIC LOGIC (Async Generator)
	// ==========================================

	async *run() {
		// A basic button interaction intention:
		// We simply yield ourselves as a 'button_click' intent.
		// Adaptors will render the button and wait for the click event.
		const response = yield {
			type: 'ask',
			field: 'action',
			schema: { help: 'Click the button to proceed' },
			component: 'Button',
			model: /** @type {any} */ (this),
		}

		return { type: 'result', data: { clicked: true, ...response } }
	}
}
