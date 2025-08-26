/**
 * Playground entry point.
 *
 * Choose which demo to run:
 *   1) Select a language
 *   2) Registration Form
 *   3) Currency Exchange
 *   4) Top‑up Telephone
 *
 * Type 0 to exit.
 */
import { argv } from "node:process"
import Logger from "@nan0web/log"
import { runLanguage } from "./language.form.js"
import { runRegistration } from "./registration.form.js"
import { runExchange } from "./currency.exchange.js"
import { runTopup } from "./topup.telephone.js"
import createT, { detectLocale } from "./i18n/index.js"
import createInput, { CancelError, select } from "./ui/index.js"

const console = new Logger(Logger.detectLevel(argv))
let t = createT(detectLocale(argv))
const ask = createInput(["0"])
const menuOptions = [
	"Select a language", // t("Select a language")
	"Registration Form", // t("Registration Form")
	"Currency Exchange", // t("Currency Exchange")
	"Top‑up Telephone", // t("Top‑up Telephone")
]

async function main() {
	console.info(Logger.style(Logger.LOGO, { color: "magenta" }))

	while (true) {
		try {
			const prompt = t("[me]") + ": "
			const invalidPrompt = Logger.style(t("[me invalid]", t("[me]")), { bgColor: "yellow" }) + ": "
			const choice = await select({
				title: t("Select demo:"),
				prompt: t("[me]") + ": ",
				invalidPrompt: Logger.style(t("[me]"), { bgColor: "yellow" }) + ": ",
				options: menuOptions.map(t),
				console,
			})
			switch (choice.index) {
				case 0:
					const lang = await runLanguage(t, ask, console, prompt, invalidPrompt)
					t = createT(lang)
					break
				case 1:
					await runRegistration(t, ask, console, prompt, invalidPrompt)
					break
				case 2:
					await runExchange(t, ask, console, prompt, invalidPrompt)
					break
				case 3:
					await runTopup(t, ask, console, prompt, invalidPrompt)
					break
				default:
					console.warn(t("! Invalid choice."))
			}
		} catch (err) {
			if (err instanceof CancelError) {
				console.warn("\n" + t("⨉ Cancelled."))
				continue
			}
			throw err
		}
	}
}

main()
