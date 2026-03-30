import { test, expect } from '@playwright/test'

test('debug: check --co inheritance through shadow DOM', async ({ page }) => {
	await page.goto('/uk/CSS.html')
	await page
		.locator('master-ide')
		.locator('.theme-page')
		.waitFor({ state: 'visible', timeout: 10000 })

	// Set --co to red via JS API
	await page.evaluate(() => {
		const ide = document.querySelector('master-ide')
		ide.cssVars = { ...ide.cssVars, '--co': '#ff0000' }
	})
	await page.waitForTimeout(1000)

	const debug = await page.evaluate(() => {
		const ide = document.querySelector('master-ide')
		const sr = ide.shadowRoot

		const btn = sr.querySelector('.theme-preview-wrap ui-button')
		if (!btn) {
			const paneHtml = sr.querySelector('.props-pane')?.innerHTML?.slice(0, 300) || 'no pane'
			return { error: 'no button', paneHtml }
		}

		const hostCo = ide.style.getPropertyValue('--co')
		const rootCo = document.documentElement.style.getPropertyValue('--co')
		const btnComputedCo = getComputedStyle(btn).getPropertyValue('--co')
		const innerBtn = btn.shadowRoot?.querySelector('button')
		const innerBg = innerBtn ? getComputedStyle(innerBtn).backgroundColor : 'no inner'
		const innerCo = innerBtn ? getComputedStyle(innerBtn).getPropertyValue('--co') : 'n/a'
		const innerBtnBase = innerBtn
			? getComputedStyle(innerBtn).getPropertyValue('--btn-base')
			: 'n/a'
		const innerUiBtnBg = innerBtn
			? getComputedStyle(innerBtn).getPropertyValue('--ui-btn-bg')
			: 'n/a'

		return { hostCo, rootCo, btnComputedCo, innerBg, innerCo, innerBtnBase, innerUiBtnBg }
	})

	console.log('DEBUG:', JSON.stringify(debug, null, 2))
	// This will fail but gives us debug output
	expect(debug.innerBg || debug.error).toContain('255')
})
