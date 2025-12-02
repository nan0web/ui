import Message from "@nan0web/co"
import UIMessage from "../../../core/Message/Message.js"

class DepsCommandParams {
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

export class DepsCommand extends UIMessage {
	static Body = DepsCommandParams
	/** @type {DepsCommandParams} */
	body
	constructor(input = {}) {
		const {
			body = new DepsCommandParams()
		} = UIMessage.parseBody(input, DepsCommandParams)
		super(input)
		this.body = body
	}
}

export default DepsCommand