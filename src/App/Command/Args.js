import { empty, typeOf } from "@nan0web/types"

/**
 * Represents command arguments as an array of strings.
 * Provides utility methods for argument handling.
 */
class CommandArgs {
	/** @type {string[]} */
	args

	/**
	 * Creates a new CommandArgs instance.
	 * @param {string[]} props - Array of string arguments
	 * @throws {Error} If any argument is not a string
	 */
	constructor(props = []) {
		if (!props.every(typeOf(String))) {
			throw new Error("Every command argument must be a string")
		}
		this.args = props
	}

	/**
	 * Gets the number of arguments.
	 * @returns {number} The length of the args array
	 */
	get size() {
		return this.args.length
	}

	/**
	 * Checks if there are no arguments.
	 * @returns {boolean} True if no arguments, false otherwise
	 */
	get empty() {
		return 0 === this.size
	}

	/**
	 * Gets an argument by index.
	 * @param {number} index - The index of the argument to get
	 * @returns {string} The argument at the given index or empty string if not found
	 */
	get(index = 0) {
		return this.args[index] || ""
	}

	/**
	 * Converts the arguments to a string representation.
	 * @returns {string} Joined arguments or "<empty args>" if no arguments
	 */
	toString() {
		if (empty(this)) return "<empty args>"
		return this.args.join(" ")
	}

	/**
	 * Converts the arguments to an array.
	 * @returns {string[]} The args array
	 */
	toArray() {
		return this.args
	}

	/**
	 * Creates a CommandArgs instance from the given props.
	 * @param {CommandArgs|string[]} props - The properties to create from
	 * @returns {CommandArgs} A CommandArgs instance
	 */
	static from(props) {
		if (props instanceof CommandArgs) return props
		return new this(props)
	}
}

export default CommandArgs
