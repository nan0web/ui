import { test, expect } from '@playwright/test'

test.describe('v1.5.2: Properties panel shows content, not label', () => {
	test('Button editableProps has content key', async ({ page }) => {
		await page.goto('/Actions/Button.html')
		await page.waitForSelector('master-ide')
		await page.waitForTimeout(2000)

		const result = await page.evaluate(() => {
			const ide = document.querySelector('master-ide')
			return { keys: Object.keys(ide.editableProps) }
		})

		expect(result.keys).toContain('content')
		expect(result.keys).not.toContain('label')
	})
})
