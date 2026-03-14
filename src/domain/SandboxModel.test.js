import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { SandboxModel } from './SandboxModel.js'

describe('Domain: Sandbox Environment Testing', () => {
	it('SandboxModel coordinates component listing, config tuning, and theme exporting', async () => {
		const sandbox = new SandboxModel({ components: ['Button', 'Table', 'Input'] })
		const iterator = sandbox.run()

		// Step 1: Component Selection
		let intent = await iterator.next()
		assert.equal(intent.value.type, 'ask')
		assert.equal(intent.value.component, 'Select')
		assert.deepEqual(intent.value.schema.options, ['Button', 'Table', 'Input'])

		// Assert Validation works mapping against the components registry
		const listValidateFn = intent.value.schema.validate
		assert.notEqual(listValidateFn('Spinner'), true) // Invalid
		assert.equal(listValidateFn('Button'), true) // Valid

		// User selects 'Button'
		intent = await iterator.next({ value: 'Button' })

		// Step 2: Sandbox Editor Wrapping (configuring properties)
		assert.equal(intent.value.type, 'ask')
		assert.equal(intent.value.component, 'SandboxWrapper')
		assert.equal(intent.value.schema.name, 'ButtonModel')

		// User provides theme tweaks (mocking JSON diff)
		const mockedThemeData = { variant: 'info', size: 'lg', color: '#ff0000' }
		intent = await iterator.next({ value: mockedThemeData })

		// Step 3: Format Output Selection
		assert.equal(intent.value.type, 'ask')
		assert.equal(intent.value.component, 'Select')
		assert.deepEqual(intent.value.schema.options, ['yaml', 'css', 'json'])
		
		// User chooses 'css'
		intent = await iterator.next({ value: 'css' })

		// Step 4: Toast Log for successful export into economy theme registry
		assert.equal(intent.value.type, 'log')
		assert.equal(intent.value.component, 'Toast')
		assert.equal(intent.value.level, 'success')
		assert.ok(intent.value.message.includes('CSS! Ready for the UI Theme Store.'))

		// Application Final Result Payload
		const finalResult = await iterator.next()
		assert.equal(finalResult.value.type, 'result')
		assert.equal(finalResult.value.data.targetComponent, 'Button')
		assert.equal(finalResult.value.data.exportFormat, 'css')
		assert.deepEqual(finalResult.value.data.themeConfig, mockedThemeData)
	})
})
