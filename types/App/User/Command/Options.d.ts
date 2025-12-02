export default UserAppCommandOptions;
/**
 * Extends CommandOptions to include user-specific options.
 */
declare class UserAppCommandOptions {
    /**
     * Default option values including inherited ones.
     * @type {object}
     * @property {boolean} help - Whether help is requested
     * @property {string} cwd - Current working directory
     * @property {string} user - User name
     */
    static DEFAULTS: object;
    /**
     * Creates a UserAppCommandOptions instance from the given props.
     * @param {UserAppCommandOptions|object} props - The properties to create from
     * @returns {UserAppCommandOptions} A UserAppCommandOptions instance
     */
    static from(props: UserAppCommandOptions | object): UserAppCommandOptions;
    /**
     * Creates a new UserAppCommandOptions instance.
     * @param {object} props - Options properties
     * @param {boolean} [props.help=false] - Whether help is requested
     * @param {string} [props.cwd=""] - Current working directory
     * @param {string} [props.user=""] - User name
     */
    constructor(props?: {
        help?: boolean | undefined;
        cwd?: string | undefined;
        user?: string | undefined;
    });
    /** @type {string} User name */
    user: string;
}
