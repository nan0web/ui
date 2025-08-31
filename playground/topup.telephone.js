/**
 * Simple telephone top‑up form.
 *
 * Fields: number, amount, currency
 *
 * Controls:
 *   - Input "0" on any prompt to cancel.
 *   - Empty input on final confirmation submits.
 *
 * Validation:
 *   - Phone number must contain only digits and be 7‑15 characters long.
 */
import { CancelError } from "@nan0web/ui-cli"

const rates = {
	USD: 1,
	EUR: 0.9,
	UAH: 27,
}

/** Main top‑up flow */
export async function runTopup(t, ask, console) {
	/** Choose currency */
	async function chooseCurrency(t) {
		const list = Object.keys(rates)
		console.info(t("Currency options:"))
		list.forEach((c, i) => console.info(` ${i + 1}) ${c}`))
		const input = await ask(
			`${t("Select currency")} (1-${list.length}): `,
			input => {
				input.idx = Number(input.value) - 1
				return ! (input.idx >= 0 && input.idx < list.length)
			},
			[t("Invalid choice."), t("Try again") + ":", ""].join(" ")
		)
		return list[input.idx] ?? null
	}

	/** Validate phone number */
	function isValidPhone(number) {
		return /^[0-9]{7,15}$/.test(number)
	}

	console.info("\n=== " + t("Top‑up Telephone") + " ===")
	const numberInp = await ask(
		t("Phone Number") + ": ",
		input => !isValidPhone(input.value),
		t("Invalid phone number. Use digits only, 7‑15 characters.") + ": "
	)
	if (numberInp.cancelled) throw new CancelError()
	const number = numberInp.value
	const amountInp = await ask(
		t("Top‑up Amount") + ": ",
		input => isNaN(input.value) || Number(input.value) <= 0 || Number(input.value) > 1_000_000,
		t("Amount must be a positive number below 1 million.") + ": "
	)
	if (amountInp.cancelled) throw new CancelError()
	const amount = Number(amountInp.value)
	const currency = await chooseCurrency(t)
	if (!currency) throw new CancelError()
	console.success(`\n${t("Top‑up of")} ${amount} ${currency} ${t("to")} ${number} ${t("scheduled.")}\n`)
}
