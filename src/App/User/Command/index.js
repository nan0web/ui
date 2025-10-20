import Command from "../../Command/index.js"
import CommandMessage from "./Message.js"
import CommandOptions from "./Options.js"

export { CommandMessage, CommandOptions }

export default {
	...Command,
	Message: CommandMessage,
	Options: CommandOptions,
}
