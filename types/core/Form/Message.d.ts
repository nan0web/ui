/**
 * FormMessage – specialized InputMessage for forms.
 *
 * @class FormMessage
 * @extends InputMessage
 */
export default class FormMessage extends InputMessage {
    /**
     * Creates a FormMessage.
     *
     * @param {Object} [input={}] - Message properties.
     */
    constructor(input?: any);
    data: any;
    schema: any;
    /**
     * Returns a new FormMessage with merged data.
     *
     * @param {Object} newData - Data to merge.
     * @returns {FormMessage}
     */
    addData(newData: any): FormMessage;
    /**
     * Validates the provided data against the schema.
     *
     * @param {Object} data - Data to validate.
     * @returns {{isValid: boolean, errors: Object}}
     */
    validateData(data: any): {
        isValid: boolean;
        errors: any;
    };
}
import InputMessage from "../Message/InputMessage.js";
