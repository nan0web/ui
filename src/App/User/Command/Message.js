import { CommandMessage } from "../../Command/index.js"
import UserAppCommandOptions from "./Options.js"

/**
 * Extends Command.Message to include user-specific command options.
 */
class UserAppCommandMessage extends CommandMessage {
	/**
	 * Creates a new UserAppCommandMessage instance.
	 * @param {object} props - Command message properties
	 * @param {string[]} [props.args=[]] - Command arguments
	 * @param {Partial<UserAppCommandOptions>} [props.opts={}] - User-specific options
	 */
	constructor(props = {}) {
		super(props)
	}

	/** @returns {UserAppCommandOptions} */
	get opts() {
		return UserAppCommandOptions.from(super.opts)
	}

	/**
	 * @param {Partial<UserAppCommandOptions>} value
	 */
	set opts(value) {
		super.opts = UserAppCommandOptions.from(value)
	}

	/**
	 * Parses an array of strings into a UserAppCommandMessage.
	 * @param {string[] | string} value - Arguments to parse
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
