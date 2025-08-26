/**
 * Form input field descriptor.
 *
 * @class FormInput
 * @property {string} name - Field name.
 * @property {string} label - Display label.
 * @property {string} type - Input type (text, email, number, select, etc.).
 * @property {boolean} required - Whether the field is required.
 * @property {string} placeholder - Placeholder text.
 * @property {Array<string>} options - Select options (if type is 'select').
 * @property {Function|null} validator - Custom validation function.
 * @property {*} defaultValue - Default value.
 */
export default class FormInput {
    /**
     * Predefined input types.
     */
    static TYPES: {
        TEXT: string;
        EMAIL: string;
        NUMBER: string;
        SELECT: string;
        CHECKBOX: string;
        TEXTAREA: string;
    };
    /**
     * @param {*} input
     * @returns {FormInput}
     */
    static from(input: any): FormInput;
    /**
     * Create a new form input.
     *
     * @param {Object} props - Input properties.
     * @param {string} props.name - Field name.
     * @param {string} [props.label=props.name] - Display label.
     * @param {string} [props.type='text'] - Input type.
     * @param {boolean} [props.required=false] - Is required.
     * @param {string} [props.placeholder=''] - Placeholder.
     * @param {Array<string>} [props.options=[]] - Select options.
     * @param {Function} [props.validator=null] - Custom validator.
     * @param {*} [props.defaultValue=null] - Default value.
     */
    constructor(props: {
        name: string;
        label?: string | undefined;
        type?: string | undefined;
        required?: boolean | undefined;
        placeholder?: string | undefined;
        options?: string[] | undefined;
        validator?: Function | undefined;
        defaultValue?: any;
    });
    /** @type {string} */ name: string;
    /** @type {string} */ label: string;
    /** @type {string} */ type: string;
    /** @type {boolean} */ required: boolean;
    /** @type {string} */ placeholder: string;
    /** @type {Array<string>} */ options: Array<string>;
    /** @type {Function|null} */ validator: Function | null;
    /** @type {*} */ defaultValue: any;
    requireValidType(): void;
    /**
     * Serialises the input to a plain JSON object.
     *
     * @returns {Object}
     */
    toJSON(): any;
}
