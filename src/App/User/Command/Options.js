import CommandOptions from "../../Command/Options.js"

/**
 * Extends CommandOptions to include user-specific options.
 */
class UserAppCommandOptions extends CommandOptions {
	/**
	 * Default option values including inherited ones.
	 * @type {object}
	 * @property {boolean} help - Whether help is requested
	 * @property {string} cwd - Current working directory
	 * @property {string} user - User name
	 */
	static DEFAULTS = {
		...CommandOptions.DEFAULTS,
		user: "",
	}
	
	/** @type {string} User name */
	user
	
	/**
	 * Creates a new UserAppCommandOptions instance.
	 * @param {object} props - Options properties
	 * @param {boolean} [props.help=false] - Whether help is requested
	 * @param {string} [props.cwd=""] - Current working directory
	 * @param {string} [props.user=""] - User name
	 */
	constructor(props = {}) {
		const {
			user = UserAppCommandOptions.DEFAULTS.user,
		} = props
		super(props)
		this.user = String(user)
	}
	
	/**
	 * Creates a UserAppCommandOptions instance from the given props.
	 * @param {UserAppCommandOptions|object} props - The properties to create from
	 * @returns {UserAppCommandOptions} A UserAppCommandOptions instance
	 */
	static from(props) {
		if (props instanceof UserAppCommandOptions) return props
		return new this(props)
	}
}

export default UserAppCommandOptions