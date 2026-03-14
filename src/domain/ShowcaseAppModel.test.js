import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { ShowcaseAppModel } from './ShowcaseAppModel.js'

describe('Domain: OLMUI Application Scenario Testing (Phase 2)', () => {
	it('ShowcaseAppModel completes full user journey traversing all components', async () => {
		const app = new ShowcaseAppModel()
		const iterator = app.run()

		// Step 1: Click the Start Button
		let intent = await iterator.next()
		assert.equal(intent.value.type, 'ask')
		assert.equal(intent.value.component, 'Button')
		assert.equal(intent.value.model.content, 'Start Showcase')

		// Confirm the button click
		intent = await iterator.next({ value: { clicked: true } })

		// Step 2: Name Input validation
		assert.equal(intent.value.type, 'ask')
		assert.equal(intent.value.component, 'Input')
		assert.equal(intent.value.schema.help, 'Enter your name to begin')
		
		const nameValidateFn = intent.value.schema.validate
		assert.notEqual(nameValidateFn('Ya'), true) // Fails pattern (.{3,})
		assert.equal(nameValidateFn('Yaroslav'), true) // Succeeds

		// Submit name
		intent = await iterator.next({ value: 'Yaroslav' })

		// Step 3: Role Selection
		assert.equal(intent.value.type, 'ask')
		assert.equal(intent.value.component, 'Select')
		assert.ok(intent.value.schema.options.includes('Developer'))

		// Select a role
		intent = await iterator.next({ value: 'Developer' })

		// Step 4: Tool Autocomplete
		assert.equal(intent.value.type, 'ask')
		assert.equal(intent.value.component, 'Autocomplete')

		intent = await iterator.next({ value: 'Node.js' })

		// Step 5: Final confirmation dialog
		assert.equal(intent.value.type, 'ask')
		assert.equal(intent.value.component, 'Confirm')
		assert.ok(intent.value.schema.help.includes('Ready to generate profile for Yaroslav (Developer)'))

		intent = await iterator.next({ value: true })

		// Step 6: Watch the loading spinner
		assert.equal(intent.value.type, 'progress')
		assert.equal(intent.value.component, 'Spinner')
		
		intent = await iterator.next() // Spinner completes instantly

		// Watch the Toast log notification
		assert.equal(intent.value.type, 'log')
		assert.equal(intent.value.component, 'Toast')
		assert.equal(intent.value.message, 'Profile generated successfully!')
		assert.equal(intent.value.level, 'info') // Built off success variant

		intent = await iterator.next() // Toast completes

		// Step 7: View the final Data Table
		assert.equal(intent.value.type, 'log')
		assert.equal(intent.value.component, 'Table')
		assert.equal(intent.value.model.rows.length, 4) // Data rows

		// The final Generator return (app result payload)
		const finalResult = await iterator.next()
		assert.equal(finalResult.value.type, 'result')
		assert.equal(finalResult.value.data.success, true)
		assert.deepEqual(finalResult.value.data.profile, {
			userName: 'Yaroslav',
			role: 'Developer',
			tool: 'Node.js'
		})
		assert.equal(finalResult.value.data.rowsDisplayed, 4)
	})

	it('ShowcaseAppModel gracefully aborts when user cancels at Confirm step', async () => {
		const app = new ShowcaseAppModel()
		const iterator = app.run()

		await iterator.next() // to Button
		await iterator.next({ value: { clicked: true } }) // to Input
		await iterator.next({ value: 'Yaroslav' }) // to Select
		await iterator.next({ value: 'Developer' }) // to Autocomplete
		let intent = await iterator.next({ value: 'Node.js' }) // to Confirm
		
		assert.equal(intent.value.component, 'Confirm')

		// User clicks 'Cancel' (sends false)
		intent = await iterator.next({ value: false })

		// Application should yield a Toast message
		assert.equal(intent.value.type, 'log')
		assert.equal(intent.value.component, 'Toast')
		assert.equal(intent.value.level, 'warn')
		assert.ok(intent.value.message.includes('Operation aborted'))

		// Final return is a failure result
		const finalResult = await iterator.next()
		assert.equal(finalResult.value.type, 'result')
		assert.equal(finalResult.value.data.success, false)
		assert.equal(finalResult.value.data.reason, 'user_aborted')
	})
})
