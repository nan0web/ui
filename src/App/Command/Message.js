import { empty, typeOf } from "@nan0web/types"
import InputMessage from "../../InputMessage.js"
import CommandOptions from "./Options.js"
import CommandArgs from "./Args.js"

/**
 * Represents a command message containing arguments and options.
 * Extends InputMessage to provide structured command parsing.
 */
class CommandMessage extends InputMessage {
	/** @type {CommandArgs} */
	args
	/** @type {CommandOptions} */
	opts
	
	/**
	 * Creates a new CommandMessage instance.
	 * @param {object} props - The properties for the command message
	 * @param {string[]} props.args - Array of command arguments
	 * @param {object} props.opts - Object containing command options
	 * @throws {TypeError} If props is not an object
	 */
	constructor(props = {}) {
		super(props)
		if (!typeOf(Object)(props)) {
			throw new TypeError("Constructor value must be an Object")
		}
		const {
			args = new CommandArgs(props?.args),
			opts = new CommandOptions(props?.opts),
		} = props
		this.args = CommandArgs.from(args)
		this.opts = CommandOptions.from(opts)
	}

	/**
	 * Checks if both args and opts are empty.
	 * @returns {boolean} True if both args and opts are empty, false otherwise
	 */
	get empty() {
		return empty(this.args) && empty(this.opts)
	}

	/**
	 * Converts the command message to a string representation.
	 * @returns {string} String representation of the command or "<empty command>" if empty
	 */
	toString() {
		if (empty(this)) return "<empty command>"
		const argv = [
			String(this.opts),
			String(this.args),
		]
		return argv.join(" ").trim()
	}
	
	/**
	 * Parses an array of strings into a CommandMessage.
	 * @param {string[]} Arguments to parse
	 * @returns {CommandMessage} Parsed command message
	 */
	static parse(value = []) {
		/** @note command line configuration message */
		const result = { args: [], opts: {} }
		let i
		for (i = 0; i < value.length - 1; i++) {
			const curr = value[i]
			const next = value[i + 1]
			if (curr.startsWith('--')) {
				result.opts[curr.slice(2)] = true
			}
			else if (curr.startsWith('-')) {
				if (next.startsWith('-')) {
					result.opts[curr.slice(1)] = true
				}
				else {
					result.opts[curr.slice(1)] = next
					++i
				}
			}
			else {
				result.args.push(curr)
			}
		}
		if (i < value.length) {
			const curr = value[i]
			if (curr.startsWith('--')) {
				result.opts[curr.slice(2)] = true
			}
			else if (curr.startsWith('-')) {
				result.opts[curr.slice(1)] = true
			}
			else {
				result.args.push(curr)
			}
		}
		return new this(result)
	}
	
	/**
	 * Creates a CommandMessage instance from the given props.
	 * @param {CommandMessage|object} props - The properties to create from
	 * @returns {CommandMessage} A CommandMessage instance
	 */
	static from(props) {
		if (props instanceof CommandMessage) return props
		return new this(props)
	}
}

export default CommandMessage