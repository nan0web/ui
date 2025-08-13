import App from "../Core/index.js"
import Command from "./Command/index.js"

/**
 * UserUI connects UserApp and View.
 * It asks user for name if not provided in command input.
 * Allows user to change user data to see another Welcome view.
 */
export default class UserUI extends App.UI {
	/**
	 * Convert raw input to CommandMessage array.
	 * If user.name provided in rawInput, use it directly.
	 * Otherwise ask user for name.
	 * @param {any} rawInput - Raw input to convert
	 * @returns {Command.Message[]} Array of command messages
	 */
	convertInput(rawInput) {
		return [Command.Message.parse(rawInput)]
	}
}