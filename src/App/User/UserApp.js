import { notEmpty } from "@nan0web/types"
import CoreApp from "../Core/CoreApp.js"
import Command, { CommandMessage } from "./Command/index.js"
import User from "../../Model/User/User.js"
import UserUI from "./UserUI.js"
import InputMessage from "../../InputMessage.js"

/**
 * UserApp requires user name and shows Welcome view.
 * If user.name is provided in command input, ignores user input.
 * User can change user data to see another Welcome view.
 */
class UserApp extends CoreApp {
	/** @type {CommandMessage} Starting command parsed from argv */
	startCommand

	/** @type {object} App state */
	state

	/**
	 * Creates a new UserApp instance.
	 * @param {object} props - UserApp properties
	 * @param {string} [props.name="UserApp"] - App name
	 * @param {object} [props.state={}] - Initial state object
	 * @param {string[]} [props.argv=[]] - Command line arguments to parse
	 */
	constructor(props = {}) {
		super(props)
		const {
			argv = [],
			state = {},
		} = props
		this.state = state
		this.startCommand = CommandMessage.parse(argv)
		this.registerCommand("setUser", this.setUser.bind(this))
		this.registerCommand("welcome", this.welcome.bind(this))
	}

	/**
	 * Set user data from params.
	 * @param {CommandMessage} cmd - Command message with user data
	 * @param {UserUI} ui - UI instance
	 * @returns {Promise<{ message: string }>} Welcome message
	 */
	async setUser(cmd, ui) {
		this.state.user = User.from(cmd.opts.user)
		const frame = await this.welcome(cmd, ui)
		return {
			message: String(frame)
		}
	}

	/**
	 * Show welcome message for current user.
	 * @param {CommandMessage} cmd - Command message
	 * @param {UserUI} ui - UI instance
	 * @returns {Promise<string[][]>} Welcome view output
	 */
	async welcome(cmd, ui) {
		if (cmd.opts.user) {
			const user = User.from(cmd.opts.user)
			return ui.render("Welcome", { user })
		}
		if (notEmpty(this.user)) {
			return ui.render("Welcome", { user: this.user })
		}
		const answer = await ui.ask(InputMessage.from("What is your name?"))
		this.user = User.from(answer?.value)
		return ui.render("Welcome", { user: this.user })
	}
}

export default UserApp
