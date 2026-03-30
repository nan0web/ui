import { test, expect } from '@playwright/test'

/**
 * Helper: ensures the IDE is fully loaded and sidebar is accessible.
 * On mobile (≤768px) the sidebar starts off-screen, so we need to open it first.
 */
async function ensureIDEReady(page) {
	await page.goto('/uk/Feedback/Alert.html')
	await expect(page.locator('.toolbar h2')).toBeVisible({ timeout: 10000 })
}

/**
 * Helper: select a component, handling mobile sidebar toggle.
 */
async function selectComponent(page, name) {
	const viewportWidth = page.viewportSize()?.width || 1200
	const isMobile = viewportWidth <= 768

	const currentTitle = await page
		.locator('.toolbar h2')
		.innerText()
		.catch(() => '')
	if (currentTitle === name) return

	if (isMobile) {
		const toggle = page.locator('.sidebar-toggle')
		await toggle.click()
		await page.waitForTimeout(400)
	}

	let sidebarItem = page.locator('.comp-item:visible').filter({ hasText: name })
	if (!(await sidebarItem.isVisible().catch(() => false))) {
		for (let attempt = 0; attempt < 10; attempt++) {
			const nextCollapsed = page.locator('.app-section:not(.expanded) .app-title').first()
			if (!(await nextCollapsed.isVisible().catch(() => false))) break
			await nextCollapsed.click()
			await page.waitForTimeout(100)
			if (await sidebarItem.isVisible().catch(() => false)) break
		}
	}

	await Promise.all([
		page.waitForURL(`**/${name}.html*`, { timeout: 5000 }).catch(() => {}),
		sidebarItem.click(),
	])
	await expect(page.locator('.toolbar h2')).toHaveText(name)
}

// ────────────────────────────────────────────────────────────
// Component Renderer E2E (visual regression) — SLOW
// Moved to separate file to keep test:e2e fast
// Run with: npx playwright test e2e/visual.spec.js
// ────────────────────────────────────────────────────────────

test.describe('Master IDE - Component Renderer E2E', () => {
	const componentsToCheck = ['Alert', 'Badge', 'Button', 'Card', 'Input']

	for (const comp of componentsToCheck) {
		test(`Should render ${comp} correctly across all variants`, async ({ page }) => {
			await ensureIDEReady(page)
			await selectComponent(page, comp)

			// Take a full-page snapshot for default state
			await expect(page).toHaveScreenshot(`${comp.toLowerCase()}-default.png`, {
				fullPage: true,
			})

			// Test each variant dynamically
			const variantPills = page.locator('.variant-pill:not(.add-btn)')
			const variantsCount = await variantPills.count()

			for (let i = 0; i < variantsCount; i++) {
				const pill = variantPills.nth(i)
				const variantText = (await pill.innerText()).trim().toLowerCase().replace(/\s+/g, '-')

				await pill.click({ force: true })
				await page.waitForTimeout(200)

				await expect(page).toHaveScreenshot(`${comp.toLowerCase()}-var-${variantText}.png`, {
					fullPage: true,
				})
			}
		})
	}
})
