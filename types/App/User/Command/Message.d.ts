export default UserAppCommandMessage;
declare const UserAppCommandMessage_base: typeof import("../../Command/Message.js").default;
/**
 * Extends Command.Message to include user-specific command options.
 */
declare class UserAppCommandMessage extends UserAppCommandMessage_base {
    /**
     * Parses an array of strings into a UserAppCommandMessage.
     * @param {string[]} value - Arguments to parse
     * @returns {UserAppCommandMessage} Parsed command message
     */
    static parse(value?: string[]): UserAppCommandMessage;
    /**
     * Creates a new UserAppCommandMessage instance.
     * @param {object} props - Command message properties
     * @param {string[]} [props.args=[]] - Command arguments
     * @param {UserAppCommandOptions|object} [props.opts={}] - User-specific options
     */
    constructor(props?: {
        args?: string[] | undefined;
        opts?: UserAppCommandOptions | object;
    });
    /** @type {UserAppCommandOptions} User-specific options */
    opts: UserAppCommandOptions;
}
import UserAppCommandOptions from "./Options.js";
