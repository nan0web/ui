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
		// 1. List available components and ask user to select one
		const listResponse = yield {
			type: 'ask',
			field: 'selectedComponent',
			schema: {
				help: 'Select a component to inspect and theme',
				options: this.components || [],
				validate: (val) => (this.components || []).includes(val) || 'Component not found in sandbox registry',
			},
			component: 'Select',
			model: /** @type {any} */ (this),
		}

		this.selectedComponent = listResponse.value

		// Dynamically instantiate the selected model class to inspect its properties
		const TargetModelConstructor = ComponentModels[`${this.selectedComponent}Model`]
		const targetInstance = TargetModelConstructor ? new TargetModelConstructor() : this

		// 2. Wrap the selected component in a Sandbox IDE editor to configure properties
		const configResponse = yield {
			type: 'ask',
			field: 'componentThemeConfig',
			schema: TargetModelConstructor || {
				help: `Configure properties for ${this.selectedComponent} to create a theme variation`,
			},
			component: 'SandboxWrapper',
			model: true,
			instance: /** @type {any} */ (targetInstance), // pass the instance explicitly
		}

		// 3. Ask for the output theme format for saving/exporting
		const formatResponse = yield {
			type: 'ask',
			field: 'themeFormat',
			schema: {
				help: 'Choose how to export the theme configuration',
				options: SandboxModel.themeFormat.options,
			},
			component: 'Select',
			model: /** @type {any} */ (this),
		}

		this.themeFormat = formatResponse.value

		// 4. Yield a log/success notification about the Theme export
		yield {
			type: 'log',
			level: 'success',
			message: `Theme correctly exported as ${this.themeFormat.toUpperCase()}! Ready for the UI Theme Store.`,
			component: 'Toast',
			model: /** @type {any} */ (this),
		}

		// 5. Return the resulting configuration context
		return { 
			type: 'result', 
			data: { 
				targetComponent: this.selectedComponent, 
				themeConfig: configResponse.value, 
				exportFormat: this.themeFormat 
			} 
		}
	}
}
