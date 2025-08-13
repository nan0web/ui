export default CommandMessage;
/**
 * Represents a command message containing arguments and options.
 * Extends InputMessage to provide structured command parsing.
 */
declare class CommandMessage extends InputMessage {
    /**
     * Parses an array of strings into a CommandMessage.
     * @param {string[]} Arguments to parse
     * @returns {CommandMessage} Parsed command message
     */
    static parse(value?: any[]): CommandMessage;
    /**
     * Creates a CommandMessage instance from the given props.
     * @param {CommandMessage|object} props - The properties to create from
     * @returns {CommandMessage} A CommandMessage instance
     */
    static from(props: CommandMessage | object): CommandMessage;
    /**
     * Creates a new CommandMessage instance.
     * @param {object} props - The properties for the command message
     * @param {string[]} props.args - Array of command arguments
     * @param {object} props.opts - Object containing command options
     * @throws {TypeError} If props is not an object
     */
    constructor(props?: {
        args: string[];
        opts: object;
    });
    /** @type {CommandArgs} */
    args: CommandArgs;
    /** @type {CommandOptions} */
    opts: CommandOptions;
}
import InputMessage from "../../InputMessage.js";
import CommandArgs from "./Args.js";
import CommandOptions from "./Options.js";
