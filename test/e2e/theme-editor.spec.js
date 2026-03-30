import { test, expect } from '@playwright/test'

/**
 * E2E: Theme Editor — CSS variables must propagate to components.
 */
test.describe('Theme Editor — CSS Variable Propagation', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/uk/CSS.html')
		await page.locator('.theme-page').waitFor({ state: 'visible', timeout: 10000 })
	})

	test('changing --co via IDE API updates Primary button', async ({ page }) => {
		// Directly call the IDE's cssVars setter to change --co to red
		await page.evaluate(() => {
			const ide = document.querySelector('master-ide')
			ide.cssVars = { ...ide.cssVars, '--co': '#ff0000' }
		})
		await page.waitForTimeout(500)

		// Verify :root now has --co = #ff0000
		const rootCo = await page.evaluate(() =>
			document.documentElement.style.getPropertyValue('--co').trim(),
		)
		expect(rootCo).toBe('#ff0000')

		// Verify host inline style
		const hostCo = await page.evaluate(() => {
			const ide = document.querySelector('master-ide')
			return ide.style.getPropertyValue('--co').trim()
		})
		expect(hostCo).toBe('#ff0000')

		// Verify button actually changed color (deep inside shadow DOM)
		const btnBg = await page.evaluate(() => {
			const ide = document.querySelector('master-ide')
			const btn = ide.shadowRoot.querySelector('.theme-preview-wrap ui-button')
			if (!btn) return 'NO_BUTTON_FOUND'
			const inner = btn.shadowRoot?.querySelector('button') || btn
			return getComputedStyle(inner).backgroundColor
		})

		// Must contain 255 (red channel of #ff0000)
		expect(btnBg).toContain('255')
		expect(btnBg).not.toBe('rgb(0, 153, 220)')
	})

	test('color input dispatches @input which triggers reactive update', async ({ page }) => {
		// Change --co via the ui-color-rgb component inside master-ide shadow DOM
		await page.evaluate(() => {
			const ide = document.querySelector('master-ide')
			const colorComp = ide.shadowRoot.querySelector('ui-color-rgb')
			if (!colorComp) throw new Error('No ui-color-rgb component found')
			const colorInput = colorComp.shadowRoot.querySelector('input[type="color"]')
			if (!colorInput) throw new Error('No color input in ui-color-rgb shadow')
			colorInput.value = '#00ff00'
			colorInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
		})
		await page.waitForTimeout(500)

		// Check if the cssVars object was updated
		const coVal = await page.evaluate(() => {
			const ide = document.querySelector('master-ide')
			return ide.cssVars['--co']
		})
		expect(coVal).toBe('#00ff00')
	})

	test('/uk/CSS.html loads Theme Editor, not documentation', async ({ page }) => {
		const toolbar = page.locator('master-ide').locator('.toolbar h2')
		await expect(toolbar).toHaveText('Налаштування теми (CSS)')
		await expect(page.locator('master-ide').locator('.theme-page')).toBeVisible()
		await expect(
			page.locator('master-ide').locator('.pane-label').filter({ hasText: 'Live Preview' }),
		).toBeVisible()
	})

	test('CSS variables are set on host and :root after load', async ({ page }) => {
		const coValue = await page.evaluate(() => {
			const ide = document.querySelector('master-ide')
			return ide.style.getPropertyValue('--co').trim()
		})
		expect(coValue).toBeTruthy()
		expect(coValue).toMatch(/#[0-9a-fA-F]{6}/)
	})
})
