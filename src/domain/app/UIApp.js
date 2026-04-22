import { ModelAsApp } from '../ModelAsApp.js'
import { resolvePositionalArgs } from '@nan0web/ui-cli'
import SnapshotAuditor from './SnapshotAuditor.js'
import GalleryCommand from './GalleryCommand.js'
import { show, result } from '../../core/Intent.js'

export class UIApp extends ModelAsApp {
	static command = {
		type: 'string',
		help: 'Command to run (e.g. gallery)',
		options: [GalleryCommand, SnapshotAuditor],
		default: GalleryCommand.alias || GalleryCommand.name,
		positional: true,
	}

	static UI = {
		helpText: [
			'# ✨ NaN•Web UI CLI',
			'',
			'Zero-Hallucination Tools for the NaN•Web ecosystem.',
			'',
			'## Usage',
			'',
			'```bash',
			'',
			'nan0ui gallery audit',
			'',
			'nan0ui gallery render',
			'',
			'```',
		].join('\n'),
		unknownCommand: 'Unknown command: {command}',
	}

	static help = {
		help: 'Show help message',
		default: false,
	}

	/**
	 * @param {Partial<UIApp> | Record<string, any>} [data={}]
	 * @param {import('@nan0web/types').ModelOptions} [options={}]
	 */
	constructor(data = {}, options = {}) {
		super(data, options)
		/** @type {string[]} */ this._positionals = []
		/** @type {string} Type of command to run */ this.command
		/** @type {boolean} Show help message */ this.help
	}

	async *run() {
		const t = this._.t
		if (this.help || this.command === 'help') {
			yield show(t(UIApp.UI.helpText, undefined))
			return result({})
		}

		const TargetCommand = UIApp.command.options.find((opt) =>
			[opt.alias, opt.name].includes(this.command),
		)

		if (!TargetCommand) {
			yield show(t(UIApp.UI.unknownCommand, { command: this.command }), 'error')
			return result({ status: 'error' })
		}

		// Pass remaining positionals down to the target action
		const nextData = resolvePositionalArgs(
			/** @type {any} */ (TargetCommand),
			this._positionals || [],
			this
		)
		const intent = new TargetCommand(nextData, this._)
		return yield* intent.run()
	}
}

export default UIApp
