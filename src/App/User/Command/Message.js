import Command from "../../Command/index.js"
import UserAppCommandOptions from "./Options.js"

/**
 * Extends Command.Message to include user-specific command options.
 */
class UserAppCommandMessage extends Command.Message {
	/** @type {UserAppCommandOptions} User-specific options */
	opts
	
	/**
	 * Creates a new UserAppCommandMessage instance.
	 * @param {object} props - Command message properties
	 * @param {string[]} [props.args=[]] - Command arguments
	 * @param {UserAppCommandOptions|object} [props.opts={}] - User-specific options
	 */
	constructor(props = {}) {
		super(props)
		const {
			opts = new UserAppCommandOptions(props?.opts),
		} = props
		this.opts = UserAppCommandOptions.from(opts)
	}
	
	/**
	 * Parses an array of strings into a UserAppCommandMessage.
	 * @param {string[]} value - Arguments to parse
	 * @returns {UserAppCommandMessage} Parsed command message
	 */
	static parse(value = []) {
		if ("string" === typeof value) {
			value = value.split(" ")
		}
		const result = super.parse(value)
		return new this(result)
	}
}

export default UserAppCommandMessage