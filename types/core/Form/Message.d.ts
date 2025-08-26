/**
 * FormMessage – specialized OutputMessage for forms.
 *
 * @class FormMessage
 * @extends OutputMessage
 */
export default class FormMessage extends OutputMessage {
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
import OutputMessage from "../Message/OutputMessage.js";
