import { Model } from '@nan0web/types'

/**
 * Model-as-Schema for Table Data component.
 * Displays tabular string data in rows and columns.
 */
export class TableModel extends Model {
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

	/**
	 * @param {Partial<TableModel> | Record<string, any>} data Model input data.
	 * @param {object} [options] Extended options (db, etc.)
	 */
	constructor(data = {}, options = {}) {
		super(data, options)
		/** @type {string[]} Array of column headers */ this.columns
		/** @type {string[][]} 2D Array of table cells matching column length */ this.rows
	}

	/**
	 * @returns {AsyncGenerator<any, any, any>}
	 */
	async *run() {
		yield {
			type: 'log',
			level: 'info',
			message: `Displaying table with ${this.rows?.length || 0} rows`,
			component: 'Table',
			model: this,
		}

		return { type: 'result', data: { rowsCount: this.rows?.length || 0 } }
	}
}
