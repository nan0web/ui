import { ModelAsApp } from '../ModelAsApp.js'
import { resolvePositionalArgs } from '@nan0web/ui-cli'
import SnapshotAuditor from './SnapshotAuditor.js'
import GalleryRenderIntent from './GalleryRenderIntent.js'
import { show, result } from '../../core/Intent.js'

export class GalleryCommand extends ModelAsApp {
	static alias = 'gallery'

	static UI = {
		unknownAction: 'Unknown gallery action: {command}',
	}

	static action = {
		type: 'string',
		help: 'Command to run',
		options: [SnapshotAuditor, GalleryRenderIntent],
		default: SnapshotAuditor.alias || SnapshotAuditor.name,
		positional: true,
	}

	/**
	 * @param {Partial<GalleryCommand> | Record<string, any>} [data={}]
	 * @param {import('@nan0web/types').ModelOptions} [options={}]
	 */
	constructor(data = {}, options = {}) {
		super(data, options)
		/** @type {string} */ this.action
		/** @type {string[]} */ this._positionals = []
	}

	async *run() {
		const TargetAction = GalleryCommand.action.options.find(
			(opt) => opt.alias === this.action || opt.name === this.action
		)

		if (!TargetAction) {
			yield show(this._.t(GalleryCommand.UI.unknownAction, { command: this.action }), 'error')
			return result({ status: 'error' })
		}

		// Pass remaining positionals down to the target action
		const nextData = resolvePositionalArgs(
			/** @type {any} */ (TargetAction),
			this._positionals || [],
			this
		)
		const intent = new TargetAction(nextData, this._)
		return yield* intent.run()
	}
}

export default GalleryCommand
