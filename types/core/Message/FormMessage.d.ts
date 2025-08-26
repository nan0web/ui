/**
 * Повідомлення форми
 */
export default class FormMessage extends UIMessage {
    /**
     * @param {Object} input - Властивості повідомлення форми
     * @param {string} [input.body=""]
     * @param {string} [input.type="form"]
     * @param {string} [input.id="form-1234567890"]
     * @param {Object} [input.data={}] - Дані форми
     * @param {Object} [input.schema] - Схема валідації
     */
    constructor(input?: {
        body?: string | undefined;
        type?: string | undefined;
        id?: string | undefined;
        data?: any;
        schema?: any;
    });
    data: any;
    schema: any;
    /**
     * Додає дані до форми, зберігаючи попередні дані
     */
    addData(newData: any): FormMessage;
}
import UIMessage from "./UIMessage.js";
