import { Message } from "@nan0web/co"
import { notEmpty } from "@nan0web/types"
import CoreApp from "../Core/CoreApp.js"
import User from "../../Model/User/User.js"
import UserUI from "./UserUI.js"
import InputMessage from "../../core/Message/InputMessage.js"

/**
 * UserApp requires user name and shows Welcome view.
 * If user.name is provided in command input, ignores user input.
 * User can change user data to see another Welcome view.
 */
class UserApp extends CoreApp {
	/**
	 * Creates a new UserApp instance.
	 * @param {Partial<CoreApp>} [props={}] - UserApp properties
	 */
	constructor(props = {}) {
		super(props)
		this.registerCommand("setUser", this.setUser.bind(this))
		this.registerCommand("welcome", this.welcome.bind(this))
	}

	/**
	 * Set user data from params.
	 * @param {Message} cmd - Command message with user data
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
	 * @param {Message} cmd - Command message
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
