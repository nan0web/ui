import { describe, it, expect } from "vitest"
import { empty, notEmpty } from "@nan0web/types"
import Frame from "./Frame.js"
import stringWidth from "string-width"

describe("Frame", () => {
	it("should create empty Frame", () => {
		const frame = new Frame()
		expect(empty(frame)).toBeTruthy()
	})
	it("should create non-empty Frame", () => {
		const frame = new Frame(["Non", "empty"])
		expect(notEmpty(frame)).toBeTruthy()
	})
	it("should print empty zero and false", () => {
		const input = [
			[0, "0", false, "false"],
			[undefined, null, "", {}]
		]
		const frame = new Frame({ value: input, width: 144, height: 33 })
		expect(notEmpty(frame)).toBeTruthy()
		const rows = input.map(row => row.map(String))
		expect(frame.value).toEqual(rows)
		frame.render()
		expect(frame.imprint).toBe(
			rows.map(
				row => row.join("")
			).map(
				row => row + " ".repeat(144 - stringWidth(row))
			).join("\n")
		)
	})
	it("should print welcome", () => {
		const input = [
			["Welcome", " ", "World", "!"],
			["What can we do today great?"],
		]
		const rows = input.map(
			row => row.join("")
		).map(
			row => row + " ".repeat(144 - stringWidth(row))
		)
		const frame = new Frame({ value: input, width: 144, height: 33 })
		frame.render()
		expect(frame.imprint).toEqual(rows.join("\n"))
	})
	it("should transform value", () => {
		const frame = new Frame(["Welcome"])
		const t = v => "Вітання"
		const transformed = frame.transform(t)
		expect(transformed.value).toEqual([["Вітання"]])
	})
	it("should print special utf characters and fit the width", () => {
		const input = [
			["你好", "世界"],
			["Привіт", "Світ"],
			["こんにちは", "世界"],
		]
		const frame = new Frame(input)
		frame.render()
		const imprintLines = frame.imprint.split("\n")
		imprintLines.forEach(line => {
			expect(stringWidth(line)).toBeLessThanOrEqual(144)
		})
		expect(frame.value).toEqual(input)
	})
	it("should render table with padding", () => {
		const rows = [
			["gpt-4.1", 1_047_576],
			["gpt-4o", 128_000],
		]
		const table = Frame.table({ padding: 3 })(rows)
		expect(table).toEqual([
			["gpt-4.1   ", "1047576"],
			["gpt-4o    ", "128000"],
		])
	})
	it("should render with replace method and fill spaces", () => {
		const input = [["Test"]]
		const frame = new Frame({ value: input, width: 10, height: 3 })
		const output = frame.render({ method: Frame.RenderMethod.REPLACE }).split("\n")
		expect(output.length).toBe(3)
		expect(output[0].length - `\x1b[0;0H`.length).toBe(10)
		expect(output[1].length).toBe(10)
		expect(output[2].length).toBe(10)
	})
	it("should render with append method over previous frame", () => {
		const input = [["Append"]]
		const frame = new Frame({ value: input, width: 10, height: 3 })
		const output = frame.render({ method: "append" }).split("\n")
		expect(output.length).toBeLessThanOrEqual(3)
		expect(output[0].length).toBeLessThanOrEqual(10)
	})
	it("should render visible method", () => {
		const input = [["Visible"]]
		const frame = new Frame({ value: input, width: 10, height: 3 })
		const output = frame.render({ method: "visible" }).split("\n")
		expect(output.length).toBeLessThanOrEqual(3)
	})
	it("should handle cell options with style objects", () => {
		const input = [
			["<b>Hello</b>", "<i>World</i>"],
			["<fg=red>Red</>", "<bg=#00ff00>Green background</>"]
		]
		const frame = new Frame({ value: input, width: 20, height: 4 })
		const output = frame.render()
		expect(output.split("\n").length).toBeLessThanOrEqual(4)
	})
	it("should handle row options with style objects", () => {
		const input = [
			["Name", "Age"],
			["John", 30],
			["<u>Underlined</u>", "<s>Strikethrough</s>", { color: "blue" }]
		]
		const frame = new Frame({ value: input, width: 30, height: 4 })
		const output = frame.render()
		expect(output.split("\n").length).toBeLessThanOrEqual(4)
	})
	it("should handle frame options set by method with XML tags", () => {
		const input = [
			["<b>Bold</b>", "<i>Italic</i>"],
			["<fg=red>Red</fg>", "<bg=#0000ff>Blue bg</bg>"]
		]
		const frame = new Frame({ value: input, width: 20, height: 4 })
		const output = frame.render()
		expect(output.split("\n").length).toBeLessThanOrEqual(4)
	})

	it("should render correctly with different window sizes", () => {
		const input = [
			["Line 1: Hello World!"],
			["Line 2: Another line"],
			["Line 3: Yet another line"],
			["Line 4: More text here"],
			["Line 5: Last line"]
		]

		const sizes = [
			{ width: 10, height: 2 },
			{ width: 20, height: 3 },
			{ width: 50, height: 5 },
			{ width: 144, height: 33 },
		]

		sizes.forEach(({ width, height }) => {
			const frame = new Frame({ value: input, width, height })
			const output = frame.render({ method: Frame.RenderMethod.APPEND })
			const lines = output.split("\n")
			expect(lines.length).toBeLessThanOrEqual(height)
			lines.forEach(line => {
				expect(stringWidth(line)).toBeLessThanOrEqual(width)
			})
		})
	})

	// Additional tests for BOF, BOL in different positions with REPLACE, VISIBLE, APPEND

	it("should handle BOF at start with REPLACE method", () => {
		const input = [
			Frame.BOF,
			["Line 1"],
			["Line 2"]
		]
		const frame = new Frame({ value: input, width: 10, height: 4 })
		const output = frame.render({ method: Frame.RenderMethod.REPLACE })
		expect(output.startsWith(Frame.BOF)).toBe(true)
		const lines = output.split("\n")
		expect(lines.length).toBe(4)
		expect(lines[1]).toMatch(/^\s*$/) // empty row
		expect(lines.slice(-2)).toEqual(["Line 1    ", "Line 2    "])
	})

	it("should handle BOF at end with REPLACE method", () => {
		const input = [
			["Line 1"],
			["Line 2"],
			Frame.BOF
		]
		const frame = new Frame({ value: input, width: 10, height: 4 })
		const output = frame.render({ method: Frame.RenderMethod.REPLACE })
		expect(output.startsWith(Frame.BOF)).toBe(true)
		const lines = output.split("\n")
		expect(lines.length).toBe(4)
		expect(lines.slice(0, 2)).toEqual([`\x1b[0;0H` + "Line 1    ", "Line 2    "])
		expect(lines[2]).toMatch(/^\s*$/) // empty row
	})

	it("should handle BOF at start with APPEND method", () => {
		const input = [
			Frame.BOF,
			["Line 1"],
			["Line 2"]
		]
		const frame = new Frame({ value: input, width: 10, height: 4 })
		const output = frame.render({ method: Frame.RenderMethod.APPEND })
		expect(output.startsWith(Frame.BOF)).toBe(true)
		const lines = output.split("\n")
		expect(lines.length).toBeLessThanOrEqual(4)
		expect(lines.slice(-2)).toEqual(["Line 1    ", "Line 2    "])
	})

	it("should handle BOF at end with APPEND method", () => {
		const input = [
			["Line 1"],
			["Line 2"],
			Frame.BOF
		]
		const frame = new Frame({ value: input, width: 10, height: 4 })
		const output = frame.render({ method: Frame.RenderMethod.APPEND })
		expect(output.startsWith(Frame.BOF)).toBe(true)
		const lines = output.split("\n")
		expect(lines.length).toBe(4)
		expect(lines.slice(1, 3)).toEqual(["Line 2    ", ""])
	})

	it("should handle BOF at start with VISIBLE method", () => {
		const input = [
			Frame.BOF,
			["Line 1"],
			["Line 2"]
		]
		const frame = new Frame({ value: input, width: 10, height: 4 })
		const output = frame.render({ method: Frame.RenderMethod.VISIBLE })
		expect(output.startsWith(`\x1b[1A`)).toBe(true)
		const lines = output.split("\n")
		expect(lines.length).toBeLessThanOrEqual(2)
		expect(lines).toEqual([`\x1b[1A` + "Line 1", "Line 2"])
	})

	it("should handle BOF at end with VISIBLE method", () => {
		const input = [
			["Line 1"],
			["Line 2"],
			Frame.BOF
		]
		const frame = new Frame({ value: input, width: 10, height: 4 })
		const output = frame.render({ method: Frame.RenderMethod.VISIBLE })
		expect(output.startsWith(`\x1b[1A`)).toBe(true)
		const lines = output.split("\n")
		expect(lines.length).toBeLessThanOrEqual(2)
		expect(lines).toEqual([`\x1b[1A` + "Line 1", "Line 2"])
	})

	it("should handle BOL in lines with REPLACE method", () => {
		const input = [
			["Line 1" + Frame.BOL],
			["Line 2"]
		]
		const frame = new Frame({ value: input, width: 10, height: 3 })
		const output = frame.render({ method: Frame.RenderMethod.REPLACE })
		const lines = output.split("\n")
		expect(lines.some(line => line.includes(Frame.BOL))).toBe(true)
		expect(lines.length).toBe(3)
	})

	it("should handle BOL in lines with APPEND method", () => {
		const input = [
			["Line 1" + Frame.BOL],
			["Line 2"]
		]
		const frame = new Frame({ value: input, width: 10, height: 3 })
		const output = frame.render({ method: Frame.RenderMethod.APPEND })
		const lines = output.split("\n")
		expect(lines.some(line => line.includes(Frame.BOL))).toBe(true)
		expect(lines.length).toBeLessThanOrEqual(3)
	})

	it("should handle BOL in lines with VISIBLE method", () => {
		const input = [
			["Line 1" + Frame.BOL],
			["Line 2"]
		]
		const frame = new Frame({ value: input, width: 10, height: 3 })
		const output = frame.render({ method: Frame.RenderMethod.VISIBLE })
		const lines = output.split("\n")
		expect(lines.some(line => line.includes(Frame.BOL))).toBe(true)
		expect(lines.length).toBeLessThanOrEqual(3)
	})
})

describe("Frame.RenderMethod", () => {
	const table = Frame.table({
		aligns: ["r"],
		padding: 2,
	})([
		["Usage: node memory-usage.js", "", ""],
		["[process_name]", "", "Name of the process to check memory usage for"],
		["-n number_of_processes", "", "Number of top memory consumers to show (default: 9)"],
		["--help", "", "Show this help message"],
	])
	const frame = new Frame({
		value: [...table, ""],
		renderMethod: Frame.RenderMethod.REPLACE,
	})

	it("should render with REPLACE method", () => {
		const output = frame.render({
			method: Frame.RenderMethod.REPLACE,
		})
		expect(typeof output).toBe("string")
		const lines = output.split("\n")
		expect(lines.length).toBeGreaterThan(0)
		lines.forEach(line => {
			expect(line.length).toBeLessThanOrEqual(frame.width < 0 ? 144 : frame.width)
		})
	})

	it("should render with APPEND method", () => {
		const output = frame.render({ method: Frame.RenderMethod.APPEND })
		expect(typeof output).toBe("string")
		const lines = output.split("\n")
		const height = frame.height < 0 ? 10 : frame.height
		const width = frame.width < 0 ? 144 : frame.width
		expect(lines.length).toBeLessThanOrEqual(height)
		lines.forEach(line => {
			expect(line.length).toBeLessThanOrEqual(width)
		})
	})

	it("should render with VISIBLE method", () => {
		const output = frame.render({ method: Frame.RenderMethod.VISIBLE })
		expect(typeof output).toBe("string")
		const lines = output.split("\n")
		const height = frame.height < 0 ? 10 : frame.height
		const width = frame.width < 0 ? 144 : frame.width
		expect(lines.length).toBeLessThanOrEqual(height)
		lines.forEach(line => {
			expect(line.length).toBeLessThanOrEqual(width)
		})
	})
})

describe("Frame (3rd party deprecations)", () => {
	it("should detect extra lines above BOF and allow for offset rendering", () => {
		// Simulate a terminal with 2 extra lines above (e.g., from warnings)
		const extraLines = 2
		const selectBox = [
			Frame.BOF,
			["Select a command to run"],
			["[+]draw"],
			[" - send"],
			[" - stats"],
			[" - analyze"],
			[" - extract"]
		]
		const frame = new Frame({ value: selectBox, width: 30, height: 8 })
		const output = frame.render({ method: Frame.RenderMethod.REPLACE })
		// The output should start with BOF and have the select box content
		expect(output.startsWith(Frame.BOF)).toBe(true)
		const lines = output.split("\n")
		// Simulate that the select box is rendered at the top, but if there are extra lines above,
		// the select box will be shifted down by `extraLines`
		// To check for this, we can simulate a "screen" with extra lines and see where the select box appears
		const screen = [
			"DeprecationWarning: ...", // extra line 1
			"Some other warning...",   // extra line 2
			...lines
		]
		// The select box should appear at index `extraLines` (after the warnings)
		expect(screen[extraLines + 2]).toContain("Select a command to run")
		expect(screen[extraLines + 3]).toContain("[+]draw")
		expect(screen[extraLines + 4]).toContain("- send")
	})

	it("should allow for offset rendering by prepending empty lines before BOF", () => {
		// If you want to compensate for extra lines, you can prepend empty lines before BOF
		const extraLines = 2
		const selectBox = [
			"",
			"",
			Frame.BOF,
			["Select a command to run"],
			["[+]draw"],
			[" - send"],
			[" - stats"],
			[" - analyze"],
			[" - extract"]
		]
		const frame = new Frame({ value: selectBox, width: 30, height: 10 })
		const output = frame.render({ method: Frame.RenderMethod.REPLACE })
		const lines = output.split("\n")
		// The select box should now appear after the empty lines
		expect(lines[4]).toBe("Select a command to run".padEnd(30))
		expect(lines[5]).toBe("[+]draw".padEnd(30))
	})

	it("should render select box correctly even with extra lines above (simulate terminal shift)", () => {
		// Simulate a terminal with 2 extra lines above (e.g., from warnings)
		const extraLines = 2
		const selectBox = [
			Frame.BOF,
			["Select a command to run"],
			["[+]draw"],
			[" - send"],
			[" - stats"],
			[" - analyze"],
			[" - extract"]
		]
		const frame = new Frame({ value: selectBox, width: 30, height: 8 })
		const output = frame.render({ method: Frame.RenderMethod.REPLACE })
		const lines = output.split("\n")
		// Simulate a "screen" with extra lines above
		const screen = [
			"DeprecationWarning: ...",
			"Some other warning...",
			...lines
		]
		// The select box should still be visible at the correct offset
		expect(screen[extraLines].trim()).toBe(`\x1b[0;0H`)
		expect(screen[extraLines + 1].trim()).toBe("")
		expect(screen[extraLines + 2].trim()).toBe("Select a command to run")
		expect(screen[extraLines + 3].trim()).toBe("[+]draw")
		expect(screen[extraLines + 4].trim()).toBe("- send")
		expect(screen[extraLines + 5].trim()).toBe("- stats")
		expect(screen[extraLines + 6].trim()).toBe("- analyze")
		expect(screen[extraLines + 7].trim()).toBe("- extract")
	})
})
