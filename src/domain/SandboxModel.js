import { resolveDefaults } from '@nan0web/types'
import * as ComponentModels from './components/index.js'
import { BreadcrumbModel } from './components/BreadcrumbModel.js'

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
 * Navigation uses BreadcrumbModel:
 *   ESC = pop one level (if stack has no parent → exit app)
 *   Ctrl+C = always exit (handled by prompts.js wrapper)
 *
 * URL mapping:
 *   /sandbox             → Select Component
 *   /sandbox/button      → Edit Button properties
 *   /sandbox/button/export → Choose export format
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

	async *run() {
		/** @type {any} */
		let targetInstance = null

		// ── BreadcrumbModel as navigation stack ──
		const nav = new BreadcrumbModel()
		nav.push('🏖 Sandbox', 'sandbox')

		while (true) {
			// ── Level 1: Select Component ──
			if (!this.selectedComponent) {
				// Show breadcrumb
				yield /** @type {any} */ ({
					type: 'log', level: 'info',
					message: `\n${nav}`,
					component: 'Breadcrumbs',
					model: /** @type {any} */ (nav),
				})

				// ESC here = CancelError not caught → bubbles out → app exits
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
				nav.push(/** @type {string} */ (this.selectedComponent))

				// Instantiate the selected model class
				const Ctor = ComponentModels[`${this.selectedComponent}Model`]
				targetInstance = Ctor ? new Ctor() : this
			}

			// ── Level 2: Edit Component Properties ──
			// URL: /sandbox/button  Data: data/sandbox/button/index.yaml
			/** @type {any} */
			let configResponse
			try {
				yield /** @type {any} */ ({
					type: 'log', level: 'info',
					message: `\n${nav}`,
					component: 'Breadcrumbs',
					model: /** @type {any} */ (nav),
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
					nav.pop()
					this.selectedComponent = undefined
					continue
				}
				throw e
			}

			// Persist edits for potential back-navigation
			targetInstance = configResponse.value

			// ── Level 3: Choose Export Format ──
			// URL: /sandbox/button/export  Data: data/sandbox/button/export/index.yaml
			/** @type {any} */
			let formatResponse
			try {
				nav.push('Export', 'export')
				yield /** @type {any} */ ({
					type: 'log', level: 'info',
					message: `\n${nav}`,
					component: 'Breadcrumbs',
					model: /** @type {any} */ (nav),
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
					nav.pop()
					continue
				}
				throw e
			}

			this.themeFormat = formatResponse.value

			// 4. Success notification
			yield /** @type {any} */ ({
				type: 'log',
				level: 'success',
				message: `Theme exported as ${(this.themeFormat || 'json').toUpperCase()}! Path: ${nav.path}`,
			})

			// 5. Return result with navigation context
			return {
				type: 'result',
				data: {
					targetComponent: this.selectedComponent,
					themeConfig: configResponse.value,
					exportFormat: this.themeFormat,
					breadcrumb: nav.path,
				}
			}
		}
	}
}
