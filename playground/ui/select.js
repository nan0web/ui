import createInput from "./input.js"
import { CancelError } from "./errors.js"

/**
 * Generic selection prompt for CLI.
 * Automatically creates its own input handler.
 *
 * @param {Object} config
 * @param {string} config.title - Title shown before the list (e.g. "Select currency:")
 * @param {string} config.prompt - Main prompt text (e.g. "Choose (1-3): ")
 * @param {string} [config.invalidPrompt] - Retry message when input is invalid
 * @param {string[]} config.options - List of displayable options
 * @param {Object} config.console - Logger (console.info, console.error, etc.)
 * @param {Function} [config.ask] - Input handler
 *
 * @returns {Promise<{ index: number, value: string | null }>} Selected option
 * @throws {CancelError} if the user cancels
 */
export async function select({
	title,
	prompt,
	invalidPrompt = "Invalid choice, try again: ",
	options,
	console,
	ask = createInput(["0"]),
}) {
	if (!Array.isArray(options) || options.length === 0) {
		throw new Error("Options array is required and must not be empty")
	}

	console.info(title)
	options.forEach((option, i) => {
		console.info(` ${i + 1}) ${option}`)
	})

	const input = await ask(prompt, (input) => {
		const idx = Number(input.value) - 1
		return idx < 0 || idx >= options.length
	}, invalidPrompt)

	if (input.cancelled) {
		throw new CancelError()
	}

	const index = Number(input.value) - 1
	return {
		index,
		value: options[index],
	}
}

export default select
