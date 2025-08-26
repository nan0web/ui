export default UIMessage;
/**
 * Base UI message class.
 *
 * @class UIMessage
 * @extends BaseMessage
 */
declare class UIMessage extends BaseMessage {
    static TYPES: {
        TEXT: string;
        FORM: string;
        PROGRESS: string;
        ERROR: string;
        INFO: string;
        SUCCESS: string;
        WARNING: string;
        COMMAND: string;
        NAVIGATION: string;
    };
    /**
     * Creates a UIMessage instance from plain data.
     *
     * @param {Object} data - Message data.
     * @returns {UIMessage}
     */
    static from(data: any): UIMessage;
    /**
     * Creates a UIMessage.
     *
     * @param {Object} [input={}] - Message properties.
     */
    constructor(input?: any);
    /** @type {string} */
    type: string;
    /** @type {string} */
    id: string;
    /**
     * Checks if the message type is valid.
     *
     * @returns {boolean}
     */
    isValidType(): boolean;
    /**
     * Checks whether the message contains any body content.
     *
     * @returns {boolean}
     */
    isEmpty(): boolean;
}
import { Message as BaseMessage } from "@nan0web/co";
