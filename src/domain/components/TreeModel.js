import { resolveDefaults } from '@nan0web/types'

/**
 * @typedef {Object} TreeNode
 * @property {string} label
 * @property {boolean} [expanded]
 * @property {TreeNode[]} [children]
 */

/**
 * @typedef {Object} TreeData
 * @property {TreeNode[]} [data]
 */

/**
 * Model-as-Schema for Tree component.
 * Represents a hierarchical selection or navigation structure.
 */
export class TreeModel {
	// ==========================================
	// 1. MODEL AS SCHEMA (Static Definition)
	// ==========================================

	static data = {
		help: 'Tree nodes defining the hierarchy',
		type: 'TreeNode[]',
		default: [],
	}

	/** @type {TreeNode[]|undefined} */ data = undefined;

	/**
	 * @param {TreeData} [data]
	 */
	constructor(data = {}) {
		Object.assign(this, resolveDefaults(TreeModel, data))
	}

	// ==========================================
	// 2. AGNOSTIC LOGIC (Async Generator)
	// ==========================================

	async *run() {
		const response = yield {
			type: 'ask',
			field: 'selectedNode',
			schema: { help: 'Select a node from the tree' },
			component: 'Tree',
			model: /** @type {any} */ (this),
		}

		return { type: 'result', data: { selected: response.value } }
	}
}
