export default class FormInput {
    static TYPES: {
        TEXT: string;
        EMAIL: string;
        PASSWORD: string;
        SELECT: string;
        CHECKBOX: string;
        RADIO: string;
        DATE: string;
        NUMBER: string;
        HIDDEN: string;
    };
    static from(input: any): FormInput;
    constructor(input?: {});
    type: string;
    name: string | undefined;
    label: string | undefined;
    required: boolean;
    placeholder: string;
    options: any[];
    validator: null;
    defaultValue: string;
    hasOptions(): boolean;
    isValidType(): boolean;
}
