/**
 * @typedef {Object} AutocompleteData
 * @property {string} [content]
 * @property {string[]} [options]
 */
/**
 * Model-as-Schema for Autocomplete component.
 * Represents a text input with search suggestions.
 */
export class AutocompleteModel extends Model {
    static content: {
        help: string;
        default: string;
        type: string;
    };
    static options: {
        help: string;
        default: never[];
        type: string;
    };
    /**
     * @param {AutocompleteData | any} [data]
     */
    constructor(data?: AutocompleteData | any);
    /** @type {string|undefined} */ content: string | undefined;
    /** @type {string[]|undefined} */ options: string[] | undefined;
    run(): AsyncGenerator<{
        type: string;
        field: string;
        schema: {
            help: string;
            options: string[] | undefined;
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
export type AutocompleteData = {
    content?: string | undefined;
    options?: string[] | undefined;
};
import { Model } from '@nan0web/core';
