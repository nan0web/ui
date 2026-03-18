/**
 * @typedef {Object} TableData
 * @property {string[]} [columns]
 * @property {string[][]} [rows]
 */
/**
 * Model-as-Schema for Table Data component.
 * Displays tabular string data in rows and columns.
 */
export class TableModel extends Model {
    static columns: {
        help: string;
        type: string;
        default: string[];
    };
    static rows: {
        help: string;
        type: string;
        default: string[][];
    };
    /**
     * @param {TableData | any} [data]
     */
    constructor(data?: TableData | any);
    /** @type {string[]|undefined} */ columns: string[] | undefined;
    /** @type {string[][]|undefined} */ rows: string[][] | undefined;
    run(): AsyncGenerator<{
        type: string;
        level: string;
        message: string;
        component: string;
        model: any;
    }, {
        type: string;
        data: {
            rowsCount: number;
        };
    }, unknown>;
}
export type TableData = {
    columns?: string[] | undefined;
    rows?: string[][] | undefined;
};
import { Model } from '@nan0web/core';
