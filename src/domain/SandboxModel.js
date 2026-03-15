import { resolveDefaults } from '@nan0web/types'
import * as ComponentModels from './components/index.js'

/**
 * @typedef {Object} SandboxData
 * @property {string[]} [components]
 * @property {string} [selectedComponent]
 * @property {string} [themeFormat]
 */

/**
 * Model-as-Schema for the UI Sandbox environment.
 * Represents a tool wrapping standard OLMUI components, allowing
 * users to inspect their models, tweak variables interactively,
 * and export the configuration as themes for the Marketplace.
 *
 * Navigation uses a breadcrumb stack:
 *   ESC = pop one level (if stack empty → exit app)
 *   Ctrl+C = always exit (handled by prompts.js wrapper)
 */
export class SandboxModel {
	// ==========================================
	// 1. MODEL AS SCHEMA (Static Definition)
	// ==========================================

	static components = {
		help: 'List of registered UI components available for inspection',
		type: 'string[]',
		default: []
	}

	static selectedComponent = {
		help: 'The specific component chosen by the user for theming',
		type: 'string',
	}

	static themeFormat = {
		help: 'The file format chosen to export the custom theme configuration',
		options: ['yaml', 'css', 'json'],
		default: 'yaml'
	}

	/** @type {string[]|undefined} */ components = undefined;
	/** @type {string|undefined} */ selectedComponent = undefined;
	/** @type {string|undefined} */ themeFormat = undefined;

	/**
	 * @param {SandboxData} [data]
	 */
	constructor(data = {}) {
		Object.assign(this, resolveDefaults(SandboxModel, data))
	}

	// ==========================================
	// 2. AGNOSTIC LOGIC (Async Generator)
	// ==========================================

	/**
	 * Navigation breadcrumb stack.
	 * ESC pops one entry. Empty stack = CancelError bubbles out → app exits.
	 * @type {string[]}
	 */
	#stack = []

	/**
	 * Format breadcrumb path for display.
	 * @returns {string} e.g. "🏖 Sandbox › Button › Export"
	 */
	#breadcrumb() {
		return this.#stack.join(' › ')
	}

	async *run() {
		/** @type {any} */
		let targetInstance = null
		this.#stack = ['🏖 Sandbox']

		while (true) {
			// ── Level 1: Select Component ──
			if (!this.selectedComponent) {
				yield /** @type {any} */ ({
					type: 'log', level: 'info',
					message: `\n${this.#breadcrumb()}`,
				})

				// ESC here is NOT caught → CancelError bubbles → app exits
				const listResponse = yield {
					type: 'ask',
					field: 'selectedComponent',
					schema: {
						help: 'Select a component to inspect and theme',
						options: this.components || [],
						validate: (/** @type {string} */ val) =>
							(this.components || []).includes(val) || 'Component not found in sandbox registry',
					},
					component: 'Select',
					model: /** @type {any} */ (this),
				}
				this.selectedComponent = listResponse.value

				// Push to breadcrumb stack
				this.#stack.push(this.selectedComponent)

				// Instantiate the selected model class
				const Ctor = ComponentModels[`${this.selectedComponent}Model`]
				targetInstance = Ctor ? new Ctor() : this
			}

			// ── Level 2: Edit Component Properties ──
			/** @type {any} */
			let configResponse
			try {
				yield /** @type {any} */ ({
					type: 'log', level: 'info',
					message: `\n${this.#breadcrumb()}`,
				})

				configResponse = yield {
					type: 'ask',
					field: 'componentThemeConfig',
					schema: ComponentModels[`${this.selectedComponent}Model`] || {
						help: `Configure properties for ${this.selectedComponent} to create a theme variation`,
					},
					component: 'SandboxWrapper',
					model: true,
					instance: /** @type {any} */ (targetInstance),
				}
			} catch (e) {
				const err = /** @type {Error} */ (e)
				if (err.name === 'CancelError') {
					// Pop: Level 2 → Level 1
					this.#stack.pop()
					this.selectedComponent = undefined
					continue
				}
				throw e
			}

			// Persist edits for potential back-navigation
			targetInstance = configResponse.value

			// ── Level 3: Choose Export Format ──
			/** @type {any} */
			let formatResponse
			try {
				this.#stack.push('Export')
				yield /** @type {any} */ ({
					type: 'log', level: 'info',
					message: `\n${this.#breadcrumb()}`,
				})

				formatResponse = yield {
					type: 'ask',
					field: 'themeFormat',
					schema: {
						help: 'Choose how to export the theme configuration',
						options: SandboxModel.themeFormat.options,
					},
					component: 'Select',
					model: /** @type {any} */ (this),
				}
			} catch (e) {
				const err = /** @type {Error} */ (e)
				if (err.name === 'CancelError') {
					// Pop: Level 3 → Level 2 (same targetInstance preserved)
					this.#stack.pop()
					continue
				}
				throw e
			}

			this.themeFormat = formatResponse.value

			// 4. Success notification
			yield /** @type {any} */ ({
				type: 'log',
				level: 'success',
				message: `Theme exported as ${(this.themeFormat || 'json').toUpperCase()}! Ready for the UI Theme Store.`,
			})

			// 5. Return result
			return {
				type: 'result',
				data: {
					targetComponent: this.selectedComponent,
					themeConfig: configResponse.value,
					exportFormat: this.themeFormat,
				}
			}
		}
	}
}
