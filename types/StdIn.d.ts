export default StdIn;
/**
 * Handles standard input stream with message buffering.
 */
declare class StdIn extends EventProcessor {
    /** @type {number} Read interval in milliseconds */
    static READ_INTERVAL: number;
    /** @type {string[]} Messages to ignore */
    static IGNORE_MESSAGES: string[];
    /**
     * Creates a StdIn instance from the given input.
     * @param {StdIn|object} input - The input to create from
     * @returns {StdIn} A StdIn instance
     */
    static from(input: StdIn | object): StdIn;
    /**
     * Creates a new StdIn instance.
     * @param {object} props - StdIn properties
     * @param {Processor} [props.processor] - Input processor
     * @param {InputMessage[]} [props.stream=[]] - Initial input stream
     */
    constructor(props?: {
        processor?: Processor | undefined;
        stream?: InputMessage[] | undefined;
    });
    /** @type {InputMessage[]} Input message buffer */
    stream: InputMessage[];
    /** @type {Processor} Input processor */
    processor: Processor;
    /**
     * Checks if there are messages waiting in the input stream.
     * @returns {boolean} True if waiting messages, false otherwise
     */
    get waiting(): boolean;
    /**
     * Checks if the input stream has ended (no messages left).
     * @returns {boolean} True if no messages left, false otherwise
     */
    get ended(): boolean;
    /**
     * Reads a message from the input stream.
     * Waits until messages are available if stream is empty.
     * @returns {Promise<InputMessage>} Next input message
     */
    read(): Promise<InputMessage>;
    /**
     * Writes a message to the input stream.
     * @param {string} message - Message to write
     * @returns {boolean} True if message accepted, False if ignored
     */
    write(message: string): boolean;
    /**
     * Decodes a message into an InputMessage instance.
     * @param {InputMessage | string[] | any} message - Message to decode
     * @returns {InputMessage} Decoded input message
     */
    decode(message: InputMessage | string[] | any): InputMessage;
}
import EventProcessor from "@nan0web/event/oop";
import InputMessage from "./InputMessage.js";
declare class Processor extends EventProcessor {
}
