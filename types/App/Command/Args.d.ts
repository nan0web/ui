export default CommandArgs;
/**
 * Represents command arguments as an array of strings.
 * Provides utility methods for argument handling.
 */
declare class CommandArgs {
    /**
     * Creates a CommandArgs instance from the given props.
     * @param {CommandArgs|string[]} props - The properties to create from
     * @returns {CommandArgs} A CommandArgs instance
     */
    static from(props: CommandArgs | string[]): CommandArgs;
    /**
     * Creates a new CommandArgs instance.
     * @param {string[]} props - Array of string arguments
     * @throws {Error} If any argument is not a string
     */
    constructor(props?: string[]);
    /** @type {string[]} */
    args: string[];
    /**
     * Gets the number of arguments.
     * @returns {number} The length of the args array
     */
    get size(): number;
    /**
     * Checks if there are no arguments.
     * @returns {boolean} True if no arguments, false otherwise
     */
    get empty(): boolean;
    /**
     * Gets an argument by index.
     * @param {number} index - The index of the argument to get
     * @returns {string} The argument at the given index or empty string if not found
     */
    get(index?: number): string;
    /**
     * Converts the arguments to a string representation.
     * @returns {string} Joined arguments or "<empty args>" if no arguments
     */
    toString(): string;
    /**
     * Converts the arguments to an array.
     * @returns {string[]} The args array
     */
    toArray(): string[];
}
