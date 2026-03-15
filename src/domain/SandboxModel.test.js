import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { SandboxModel } from './SandboxModel.js'

describe('Domain: Sandbox Environment Testing', () => {
	it('SandboxModel coordinates component listing, config tuning, and theme exporting', async () => {
		const sandbox = new SandboxModel({ components: ['Button', 'Table', 'Input'] })
		const iterator = sandbox.run()

		// Breadcrumb log: "🏖 Sandbox"
		let intent = await iterator.next()
		assert.equal(intent.value.type, 'log')
		assert.equal(intent.value.component, 'Breadcrumbs')

		// Step 1: Component Selection
		intent = await iterator.next()
		assert.equal(intent.value.type, 'ask')
		assert.equal(intent.value.component, 'Select')
		assert.deepEqual(intent.value.schema.options, ['Button', 'Table', 'Input'])

		// Assert Validation works mapping against the components registry
		const listValidateFn = intent.value.schema.validate
		assert.notEqual(listValidateFn('Spinner'), true) // Invalid
		assert.equal(listValidateFn('Button'), true) // Valid

		// User selects 'Button'
		intent = await iterator.next({ value: 'Button' })

		// Breadcrumb log: "🏖 Sandbox › Button"
		assert.equal(intent.value.type, 'log')
		assert.equal(intent.value.component, 'Breadcrumbs')
		assert.ok(intent.value.message.includes('Button'))

		// Step 2: Sandbox Editor Wrapping (configuring properties)
		intent = await iterator.next()
		assert.equal(intent.value.type, 'ask')
		assert.equal(intent.value.component, 'SandboxWrapper')
		assert.equal(intent.value.schema.name, 'ButtonModel')

		// User provides theme tweaks (mocking JSON diff)
		const mockedThemeData = { variant: 'info', size: 'lg', color: '#ff0000' }
		intent = await iterator.next({ value: mockedThemeData })

		// Breadcrumb log: "🏖 Sandbox › Button › Export"
		assert.equal(intent.value.type, 'log')
		assert.equal(intent.value.component, 'Breadcrumbs')
		assert.ok(intent.value.message.includes('Export'))

		// Step 3: Format Output Selection
		intent = await iterator.next()
		assert.equal(intent.value.type, 'ask')
		assert.equal(intent.value.component, 'Select')
		assert.deepEqual(intent.value.schema.options, ['yaml', 'css', 'json'])

		// User chooses 'css'
		intent = await iterator.next({ value: 'css' })

		// Step 4: Log for successful export
		assert.equal(intent.value.type, 'log')
		assert.equal(intent.value.level, 'success')
		assert.ok(intent.value.message.includes('CSS'))

		// Application Final Result Payload
		const finalResult = await iterator.next()
		assert.equal(finalResult.value.type, 'result')
		assert.equal(finalResult.value.data.targetComponent, 'Button')
		assert.equal(finalResult.value.data.exportFormat, 'css')
		assert.deepEqual(finalResult.value.data.themeConfig, mockedThemeData)
		assert.equal(finalResult.value.data.breadcrumb, '/sandbox/button/export')
	})
})
