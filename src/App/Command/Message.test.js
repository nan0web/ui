import { describe, it, expect } from "vitest"
import { empty } from "@nan0web/types"
import CommandMessage from "./Message.js"
import CommandOptions from "./Options.js"
import CommandArgs from "./Args.js"

describe("CommandMessage", () => {
	it("should create CommandArgs with string array", () => {
		const args = new CommandArgs(["help", "test"])
		expect(args.args).toEqual(["help", "test"])
	})

	it("should throw error for invalid CommandArgs", () => {
		const fn = () => {
			return new CommandArgs([1, 2])
		}
		expect(fn).toThrow()
	})

	it("should create CommandOptions with defaults", () => {
		const opts = new CommandOptions()
		expect(opts.help).toBe(false)
		expect(opts.cwd).toBe("")
		expect(empty(opts)).toBe(true)
	})

	it("should create CommandMessage with args and opts", () => {
		const msg = new CommandMessage({ args: ["help"], opts: { help: true } })
		expect(msg.args.args).toContain("help")
		expect(msg.opts.help).toBe(true)
	})

	it("static parse() should parse args and options", () => {
		const parsed = CommandMessage.parse(["help", "-cwd", "/tmp", "--help"])
		expect(parsed.args.args).toContain("help")
		expect(parsed.opts.cwd).toBe("/tmp")
		expect(parsed.opts.help).toBe(true)
	})
})
