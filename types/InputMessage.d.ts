export default InputMessage;
/**
 * Represents a message input with value, options, and metadata.
 */
declare class InputMessage {
    /**
     * Creates an InputMessage instance from the given value.
     * @param {InputMessage|object|string} value - The value to create from
     * @returns {InputMessage} An InputMessage instance
     */
    static from(value: InputMessage | object | string): InputMessage;
    /**
     * Creates a new InputMessage instance.
     * @param {object} props - Input message properties
     * @param {string | null} [props.value=""] - Input value
     * @param {string[]} [props.options=[]] - Available options
     * @param {boolean} [props.waiting=false] - Waiting state flag
     */
    constructor(props?: {
        value?: string | null | undefined;
        options?: string[] | undefined;
        waiting?: boolean | undefined;
    });
    /** @type {string | null} Input value */
    value: string | null;
    /** @type {string[]} Available options for this input */
    options: string[];
    /** @type {boolean} Whether this input is waiting for response */
    waiting: boolean;
    /**
     * Checks if the input value is empty.
     * @returns {boolean} True if value is empty or null, false otherwise
     */
    get empty(): boolean;
    /**
     * Gets the timestamp when input was created.
     * @returns {number} Creation timestamp
     */
    get time(): number;
    /**
     * Checks if the input is an escape sequence.
     * @returns {boolean} True if input value is escape sequence, false otherwise
     */
    get escaped(): boolean;
    /**
     * Validates if the input has a non-empty value.
     * @returns {boolean} True if input is valid, false otherwise
     */
    isValid(): boolean;
    /**
     * Converts the input to a plain object representation.
     * @returns {object} Object with all properties including timestamp
     */
    toObject(): object;
    /**
     * Converts the input to a string representation including timestamp.
     * @returns {string} String representation with timestamp and value
     */
    toString(): string;
    #private;
}
