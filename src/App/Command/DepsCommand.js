import UiMessage from "../../core/Message/Message.js"

class DepsCommandBody {
	fix = false
	static fix = {
		help: "Fix dependencies",
		defaultValue: false
	}
	constructor(input = {}) {
		const {
			fix = this.fix
		} = input
	}
}

export class DepsCommand extends UiMessage {
	static Body = DepsCommandBody
	/** @type {DepsCommandBody} */
	body
	constructor(input = {}) {
		const {
			body = new DepsCommandBody()
		} = UiMessage.parseBody(input, DepsCommandBody)
		super(input)
		this.body = body
	}
}

export default DepsCommand
