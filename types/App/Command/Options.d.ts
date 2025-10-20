export default CommandOptions;
/**
 * Represents command options with default values.
 * Provides utilities for handling command line options.
 */
declare class CommandOptions {
    /**
     * Default option values.
     * @type {object}
     * @property {boolean} help - Whether help is requested
     * @property {string} cwd - Current working directory
     */
    static DEFAULTS: object;
    /**
     * Creates a CommandOptions instance from the given props.
     * @param {CommandOptions|object} props - The properties to create from
     * @returns {CommandOptions} A CommandOptions instance
     */
    static from(props: CommandOptions | object): CommandOptions;
    /**
     * Creates a new CommandOptions instance.
     * @param {object} props - The properties for command options
     * @param {boolean} [props.help=false] - Whether help is requested
     * @param {string} [props.cwd=""] - Current working directory
     */
    constructor(props?: {
        help?: boolean | undefined;
        cwd?: string | undefined;
    });
    /** @type {boolean} Whether help is requested */
    help: boolean;
    /** @type {string} Current working directory */
    cwd: string;
    /** @type {Record<string, any>} */
    get DEFAULTS(): Record<string, any>;
    /**
     * Checks if all options have their default values.
     * @returns {boolean} True if all options are at their default values, false otherwise
     */
    get empty(): boolean;
    /**
     * Converts the options to a string representation.
     * @returns {string} String representation of the options or "<no options>" if none set
     */
    toString(): string;
}
