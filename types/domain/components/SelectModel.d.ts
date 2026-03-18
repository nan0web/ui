/**
 * @typedef {Object} SelectData
 * @property {string} [content]
 * @property {string[]} [options]
 */
/**
 * Model-as-Schema for Select component.
 * Represents a dropdown choice selection.
 */
export class SelectModel extends Model {
    static content: {
        help: string;
        default: string;
        type: string;
    };
    static options: {
        help: string;
        default: string[];
        type: string;
    };
    /**
     * @param {SelectData | any} [data]
     */
    constructor(data?: SelectData | any);
    /** @type {string|undefined} */ content: string | undefined;
    /** @type {string[]|undefined} */ options: string[] | undefined;
    run(): AsyncGenerator<{
        type: string;
        field: string;
        schema: {
            help: string;
            options: string[] | undefined;
            validate: (val: any) => true | "Invalid option selected";
        };
        component: string;
        model: any;
    }, {
        type: string;
        data: {
            selected: string | undefined;
        };
    }, unknown>;
}
export type SelectData = {
    content?: string | undefined;
    options?: string[] | undefined;
};
import { Model } from '@nan0web/core';
