import { resolveAliases, resolveDefaults } from '@nan0web/types'

export class ReleasePlanner {
	static version = {
		help: 'Версія релізу (напр. 1.0.0)',
		default: '1.0.0',
	}

	static focus = {
		help: 'Головний фокус релізу (Архітектура, Fixes, UI)',
		default: 'Архітектура',
	}

	static verified = {
		help: 'Чи пройшов код TDD та Contract Verify? (true/false)',
		default: 'false',
	}

	/** @type {string} */
	version = ReleasePlanner.version.default

	/** @type {string} */
	focus = ReleasePlanner.focus.default

	/** @type {boolean} */
	verified = ReleasePlanner.verified.default === 'true'

	constructor(data = {}) {
		resolveDefaults(ReleasePlanner, this)
		Object.assign(this, resolveAliases(ReleasePlanner, data))

		// Map string booleans if typed from cli
		if (typeof this.verified === 'string') {
			this.verified = this.verified === 'true'
		}
	}

	generateMarkdown() {
		return [
			`# 📦 Release Plan: v${this.version}`,
			``,
			`**🎯 Focus:** ${this.focus}`,
			`**🛡️ Verified:** ${this.verified ? '✅ Так' : '❌ Ні (Потрібен Contract Verify)'}`,
			``,
			`## Задачі пулу:`,
			`- [ ] Оновлені тести`,
			`- [ ] Оновлена документація (README.md.js / Docs Site)`,
		].join('\n')
	}
}
