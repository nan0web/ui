import { resolveDefaults } from '@nan0web/types'

/**
 * @typedef {Object} TableData
 * @property {string[]} [columns]
 * @property {string[][]} [rows]
 */

/**
 * Model-as-Schema for Table Data component.
 * Displays tabular string data in rows and columns.
 */
export class TableModel {
	// ==========================================
	// 1. MODEL AS SCHEMA (Static Definition)
	// ==========================================

	static columns = {
		help: 'Array of column headers',
		type: 'string[]',
		default: ['Header 1', 'Header 2'],
	}

	static rows = {
		help: '2D Array of table cells matching column length',
		type: 'string[][]',
		default: [
			['Cell 1.1', 'Cell 1.2'],
			['Cell 2.1', 'Cell 2.2'],
		],
	}

	/** @type {string[]|undefined} */ columns = undefined;
	/** @type {string[][]|undefined} */ rows = undefined;

	/**
	 * @param {TableData} [data]
	 */
	constructor(data = {}) {
		Object.assign(this, resolveDefaults(TableModel, data))
	}

	// ==========================================
	// 2. AGNOSTIC LOGIC (Async Generator)
	// ==========================================

	async *run() {
		// Tables are naturally result or log displays.
		// For an interactive flow, we could ask the user to 'select' a row,
		// but by default a table simply presents data.
		yield {
			type: 'log',
			level: 'info',
			message: `Displaying table with ${this.rows?.length || 0} rows`,
			component: 'Table',
			model: /** @type {any} */ (this),
		}

		return { type: 'result', data: { rowsCount: this.rows?.length || 0 } }
	}
}
