/**
 * Represents command options with default values.
 * Provides utilities for handling command line options.
 */
class CommandOptions {
	/**
	 * Default option values.
	 * @type {object}
	 * @property {boolean} help - Whether help is requested
	 * @property {string} cwd - Current working directory
	 */
	static DEFAULTS = {
		help: false,
		cwd: "",
	}
	
	/** @type {boolean} Whether help is requested */
	help
	
	/** @type {string} Current working directory */
	cwd
	
	/**
	 * Creates a new CommandOptions instance.
	 * @param {object} props - The properties for command options
	 * @param {boolean} [props.help=false] - Whether help is requested
	 * @param {string} [props.cwd=""] - Current working directory
	 */
	constructor(props = {}) {
		const {
			help = CommandOptions.DEFAULTS.help,
			cwd = CommandOptions.DEFAULTS.cwd,
		} = props
		this.help = Boolean(help)
		this.cwd = String(cwd)
	}
	
	/**
	 * Checks if all options have their default values.
	 * @returns {boolean} True if all options are at their default values, false otherwise
	 */
	get empty() {
		return Object.entries(this).every(
			([key, value]) => CommandOptions.DEFAULTS[key] === value
		)
	}
	
	/**
	 * Converts the options to a string representation.
	 * @returns {string} String representation of the options or "<no options>" if none set
	 */
	toString() {
		const opts = Object.entries(this).map(([key, value]) => {
			if (this.constructor.DEFAULTS[key] === value) return false
			const prefix = true === value ? "--" : "-"
			return `${prefix}${key}${value ? ` ${value}` : ""}`
		}).filter(Boolean)
		if (0 === opts.length) return "<no options>"
		return opts.join(" ")
	}
	
	/**
	 * Creates a CommandOptions instance from the given props.
	 * @param {CommandOptions|object} props - The properties to create from
	 * @returns {CommandOptions} A CommandOptions instance
	 */
	static from(props) {
		if (props instanceof CommandOptions) return props
		return new this(props)
	}
}

export default CommandOptions