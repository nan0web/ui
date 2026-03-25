import { InputModel, ConfirmModel, SpinnerModel, ToastModel, TableModel, ButtonModel, AutocompleteModel, SelectModel } from './components/index.js'
import { Model } from '@nan0web/core'

/**
 * Model-as-Schema for the entire UI Sandbox Showcase.
 * Represents a complete User Journey demonstrating all components.
 * Showcases OLMUI Scenario Testing capabilities.
 */
export class ShowcaseAppModel extends Model {
	// ==========================================
	// 1. MODEL AS SCHEMA (Static Definition)
	// ==========================================

	static appName = {
		help: 'Name of the showcase application',
		default: 'Component Showcase (Zero Hallucination)',
		type: 'string',
	}

	constructor(data = {}) {
		super(data)
		/** @type {string|undefined} */ this.appName
	}

	// ==========================================
	// 2. AGNOSTIC LOGIC (Async Generator)
	// ==========================================

	async *run() {
		// 1. Initial interaction: User clicks "Start Showcase" Button
		const btnIntent = yield* new ButtonModel({ content: 'Start Showcase', variant: 'primary', size: 'lg' }).run()

		if (!btnIntent.data.clicked) {
			return { type: 'result', data: { success: false, reason: 'start_cancelled' } }
		}

		// 2. Ask user for their name via Input
		const { data: nameData } = yield* new InputModel({ 
			label: 'Enter your name to begin', 
			placeholder: 'e.g. Yaroslav',
			required: true,
			pattern: '.{3,}' 
		}).run()

		const userName = /** @type {string} */ (nameData.value)

		// 3. Ask user to select their role via Select
		const { data: roleData } = yield* new SelectModel({
			options: ['Developer', 'Designer', 'Manager']
		}).run()
		
		const role = /** @type {string} */ (roleData.selected)

		// 4. Ask for their favorite tool via Autocomplete
		const { data: toolData } = yield* new AutocompleteModel({
			options: ['React', 'Lit', 'Node.js', 'Playwright', 'Vitest', 'Vite']
		}).run()

		const tool = /** @type {string} */ (toolData.selected)

		// 5. Ask for confirmation before proceeding to heavy calculation
		const confirmIntent = yield* new ConfirmModel({ message: `Ready to generate profile for ${userName} (${role})?` }).run()
		
		if (!confirmIntent.data.confirmed) {
			yield* new ToastModel({ message: 'Operation aborted.', variant: 'warning', duration: 0 }).run()
			return { type: 'result', data: { success: false, reason: 'user_aborted' } }
		}

		// 6. Demonstrate a long running progress via Spinner
		yield* new SpinnerModel({ size: 'md' }).run()

		// Simulate business logic processing delay if we were not mocked
		// But in generators this just happens immediately between yields
		
		yield* new ToastModel({ message: 'Profile generated successfully!', variant: 'success', duration: 0 }).run()

		// 7. Display the result of the showcase in a Table
		const { data: tableData } = yield* new TableModel({
			columns: ['Property', 'Value'],
			rows: [
				['Name', userName],
				['Role', role],
				['Favorite Tool', tool],
				['Status', 'Active']
			]
		}).run()

		return { type: 'result', data: { success: true, profile: { userName, role, tool }, rowsDisplayed: tableData.rowsCount } }
	}
}
