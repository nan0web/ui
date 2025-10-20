export default UserAppCommandMessage;
/**
 * Extends Command.Message to include user-specific command options.
 */
declare class UserAppCommandMessage extends CommandMessage {
    /**
     * Parses an array of strings into a UserAppCommandMessage.
     * @param {string[] | string} value - Arguments to parse
     * @returns {UserAppCommandMessage} Parsed command message
     */
    static parse(value?: string[] | string): UserAppCommandMessage;
    /**
     * Creates a new UserAppCommandMessage instance.
     * @param {object} props - Command message properties
     * @param {string[]} [props.args=[]] - Command arguments
     * @param {Partial<UserAppCommandOptions>} [props.opts={}] - User-specific options
     */
    constructor(props?: {
        args?: string[] | undefined;
        opts?: Partial<UserAppCommandOptions> | undefined;
    });
    /**
     * @param {Partial<UserAppCommandOptions>} value
     */
    set opts(arg: UserAppCommandOptions);
    /** @returns {UserAppCommandOptions} */
    get opts(): UserAppCommandOptions;
}
import { CommandMessage } from "../../Command/index.js";
import UserAppCommandOptions from "./Options.js";
