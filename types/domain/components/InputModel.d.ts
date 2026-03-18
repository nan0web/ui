/**
 * @typedef {'text'|'email'|'password'|'number'|'tel'|'url'|'date'} InputType
 * @typedef {Object} InputData
 * @property {InputType} [type]
 * @property {string} [label]
 * @property {string} [placeholder]
 * @property {boolean} [required]
 * @property {string} [pattern]
 * @property {string} [min]
 * @property {string} [max]
 * @property {string} [step]
 * @property {string} [hint]
 * @property {boolean} [disabled]
 * @property {string} [content]
 */
/**
 * Model-as-Schema for Input component.
 * Used exclusively for schema definition, validation, and editor reflection.
 */
export class InputModel extends Model {
    static type: {
        help: string;
        default: string;
        options: string[];
    };
    static label: {
        help: string;
        default: string;
        type: string;
    };
    static placeholder: {
        help: string;
        default: string;
        type: string;
    };
    static required: {
        help: string;
        default: boolean;
        type: string;
    };
    static pattern: {
        help: string;
        default: string;
        type: string;
    };
    static min: {
        help: string;
        default: string;
        type: string;
    };
    static max: {
        help: string;
        default: string;
        type: string;
    };
    static step: {
        help: string;
        default: string;
        type: string;
    };
    static hint: {
        help: string;
        default: string;
        type: string;
    };
    static disabled: {
        help: string;
        default: boolean;
        type: string;
    };
    static content: {
        help: string;
        default: string;
        type: string;
    };
    /**
     * @param {InputData | any} [data]
     */
    constructor(data?: InputData | any);
    /** @type {InputType|undefined} */ type: InputType | undefined;
    /** @type {string|undefined} */ label: string | undefined;
    /** @type {string|undefined} */ placeholder: string | undefined;
    /** @type {boolean|undefined} */ required: boolean | undefined;
    /** @type {string|undefined} */ pattern: string | undefined;
    /** @type {string|undefined} */ min: string | undefined;
    /** @type {string|undefined} */ max: string | undefined;
    /** @type {string|undefined} */ step: string | undefined;
    /** @type {string|undefined} */ hint: string | undefined;
    /** @type {boolean|undefined} */ disabled: boolean | undefined;
    /** @type {string|undefined} */ content: string | undefined;
    run(): AsyncGenerator<{
        type: string;
        field: string;
        schema: {
            help: string;
            validate: (val: any) => true | "This field is required" | "Invalid format";
        };
        component: string;
        model: any;
    }, {
        type: string;
        data: {
            value: string | undefined;
        };
    }, unknown>;
}
export type InputType = "text" | "email" | "password" | "number" | "tel" | "url" | "date";
export type InputData = {
    type?: InputType | undefined;
    label?: string | undefined;
    placeholder?: string | undefined;
    required?: boolean | undefined;
    pattern?: string | undefined;
    min?: string | undefined;
    max?: string | undefined;
    step?: string | undefined;
    hint?: string | undefined;
    disabled?: boolean | undefined;
    content?: string | undefined;
};
import { Model } from '@nan0web/core';
