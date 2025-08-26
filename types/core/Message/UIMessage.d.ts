export default UIMessage;
/**
 * Уніфікований клас для всіх повідомлень у системі
 */
declare class UIMessage extends BaseMessage {
    static from(data: any): UIMessage;
    /**
     * @param {Object} input - Властивості повідомлення
     * @param {string} [input.body]
     * @param {string} [input.type] - Тип UI елемента
     * @param {string} [input.id] - Унікальний ідентифікатор елемента
     */
    constructor(input?: {
        body?: string | undefined;
        type?: string | undefined;
        id?: string | undefined;
    });
    /** @type {string} */
    type: string;
    /** @type {string} */
    id: string;
}
import { Message as BaseMessage } from "@nan0web/co";
