import { describe, it } from "node:test"
import { strict as assert } from "node:assert"
import { empty } from "@nan0web/types"
import CommandMessage from "./Message.js"
import CommandOptions from "./Options.js"
import CommandArgs from "./Args.js"

describe("CommandMessage", () => {
	it("should create CommandArgs with string array", () => {
		const args = new CommandArgs(["help", "test"])
		assert.deepStrictEqual(args.args, ["help", "test"])
	})

	it("should throw error for invalid CommandArgs", () => {
		const fn = () => {
			return new CommandArgs([1, 2])
		}
		assert.throws(fn)
	})

	it("should create CommandOptions with defaults", () => {
		const opts = new CommandOptions()
		assert.equal(opts.help, false)
		assert.equal(opts.cwd, "")
		assert.ok(empty(opts))
	})

	it("should create CommandMessage with args and opts", () => {
		const msg = new CommandMessage({ args: ["help"], opts: { help: true } })
		assert.ok(msg.args.args.includes("help"))
		assert.equal(msg.opts.help, true)
	})

	it("static parse() should parse args and options", () => {
		const parsed = CommandMessage.parse(["help", "-cwd", "/tmp", "--help"])
		assert.ok(parsed.args.args.includes("help"))
		assert.equal(parsed.opts.cwd, "/tmp")
		assert.equal(parsed.opts.help, true)
	})
})
