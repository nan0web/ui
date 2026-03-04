import { test, expect } from '@playwright/test'

/**
 * Helper: ensures the IDE is fully loaded and sidebar is accessible.
 * On mobile (≤768px) the sidebar starts off-screen, so we need to open it first.
 */
async function ensureIDEReady(page) {
	await page.goto('/uk/Feedback/Alert.html')
	// Wait for the IDE custom element to render (toolbar always visible)
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
		// Open sidebar first
		const toggle = page.locator('.sidebar-toggle')
		await toggle.click()
		await page.waitForTimeout(400) // animation
	}

	// If item is not visible, try to expand its section
	let sidebarItem = page.locator('.comp-item:visible').filter({ hasText: name })
	if (!(await sidebarItem.isVisible().catch(() => false))) {
		// Expand collapsed sections one by one until component is visible
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
// TASK #2 — Code Tabs Fix
// ────────────────────────────────────────────────────────────

test.describe('Master IDE - Code Tabs (Task #2 Fix)', () => {
	test('Code tabs render as functional buttons, not raw text', async ({ page }) => {
		await ensureIDEReady(page)
		await selectComponent(page, 'Alert')

		// --- CORE: tabs must be real <button> elements with clean text ---
		const codeTabs = page.locator('.code-tab')
		await expect(codeTabs).toHaveCount(2)

		const htmlTab = codeTabs.nth(0)
		const yamlTab = codeTabs.nth(1)

		// Text must NOT contain template literal syntax like "${..."
		await expect(htmlTab).toHaveText(/^\s*HTML\s*$/)
		await expect(yamlTab).toHaveText(/^\s*YAML Spec\s*$/)

		// HTML tab active by default
		await expect(htmlTab).toHaveClass(/active/)
		await expect(yamlTab).not.toHaveClass(/active/)

		// Code content shows proper generated code
		const codeContent = page.locator('.code-content')
		await expect(codeContent).toContainText('ui-alert')

		// Click YAML — should switch
		await yamlTab.click()
		await expect(yamlTab).toHaveClass(/active/)
		await expect(htmlTab).not.toHaveClass(/active/)
		await expect(codeContent).not.toContainText('props:')
		await expect(codeContent).toContainText('Alert:')

		// Click HTML back
		await htmlTab.click()
		await expect(htmlTab).toHaveClass(/active/)
		await expect(codeContent).toContainText('<ui-alert')
	})

	test('Copy button exists and is clickable', async ({ page }) => {
		await ensureIDEReady(page)
		await selectComponent(page, 'Badge')

		const copyBtn = page.locator('.code-copy')
		await expect(copyBtn).toBeVisible()
		await expect(copyBtn).toHaveText(/Копіювати код/)
	})

	test('Code tabs work for multiple components', async ({ page }) => {
		await ensureIDEReady(page)

		for (const comp of ['Alert', 'Badge', 'Button']) {
			await selectComponent(page, comp)

			const tabs = page.locator('.code-tab')
			await expect(tabs).toHaveCount(2)
			await expect(tabs.nth(0)).toHaveText(/HTML/)
			await expect(tabs.nth(1)).toHaveText(/YAML/)

			const codeContent = page.locator('.code-content')
			await expect(codeContent).toBeVisible()
		}
	})
})

// ────────────────────────────────────────────────────────────
// TASK #1 — IndexedDB Persistence
// ────────────────────────────────────────────────────────────

test.describe('Master IDE - IndexedDB Persistence (Task #1)', () => {
	test('Saved variation persists across page reloads', async ({ page }) => {
		await ensureIDEReady(page)
		await selectComponent(page, 'Alert')

		// Count initial variants
		const variantPills = page.locator('.variant-pill:not(.add-btn)')
		const initialCount = await variantPills.count()

		// Click "+ Save Variation" — triggers custom modal
		const addBtn = page.locator('.variant-pill.add-btn')
		await addBtn.click()
		await page.waitForTimeout(300)

		// Fill in the custom modal input and confirm
		const modalInput = page.locator('.modal-input')
		await expect(modalInput).toBeVisible({ timeout: 3000 })
		await modalInput.fill('E2E Persisted Variant')
		await page.locator('.modal-ok').click()
		await page.waitForTimeout(500)

		// Verify new variant appeared
		const afterSaveCount = await page.locator('.variant-pill:not(.add-btn)').count()
		expect(afterSaveCount).toBe(initialCount + 1)
		await expect(
			page.locator('.variant-pill').filter({ hasText: 'E2E Persisted Variant' }),
		).toBeVisible()

		// Reload page
		await page.reload()
		// Wait for IDE to fully render after reload
		await expect(page.locator('.toolbar h2')).toBeVisible({ timeout: 10000 })

		// The default component is Alert — but we need to trigger restore
		// by re-selecting it (since constructor sets activeComponent='Alert')
		await selectComponent(page, 'Badge') // select something else first
		await selectComponent(page, 'Alert') // go back to Alert to trigger restore

		// Verify persisted variant still exists (wait for IndexedDB async restore)
		await expect(
			page.locator('.variant-pill').filter({ hasText: 'E2E Persisted Variant' }),
		).toBeVisible({ timeout: 5000 })
	})
})

// ────────────────────────────────────────────────────────────
// TASK #3 — Mobile Layout
// ────────────────────────────────────────────────────────────

test.describe('Master IDE - Mobile Layout (Task #3)', () => {
	test('Mobile: sidebar toggle visible, sidebar starts hidden', async ({ page }, testInfo) => {
		const w = page.viewportSize()?.width || 1200
		if (w > 768) {
			testInfo.skip()
			return
		}

		await page.goto('/')
		await expect(page.locator('.toolbar h2')).toBeVisible({ timeout: 10000 })

		// Toggle button should exist on mobile
		const toggle = page.locator('.sidebar-toggle')
		await expect(toggle).toBeVisible()

		// Sidebar should NOT have 'open' class by default
		const sidebar = page.locator('.sidebar')
		await expect(sidebar).not.toHaveClass(/open/)

		// Open sidebar
		await toggle.click()
		await page.waitForTimeout(400)
		await expect(sidebar).toHaveClass(/open/)

		// Backdrop visible
		const backdrop = page.locator('.sidebar-backdrop')
		await expect(backdrop).toHaveClass(/visible/)

		// Close via backdrop
		await backdrop.click({ force: true })
		await page.waitForTimeout(400)
		await expect(sidebar).not.toHaveClass(/open/)
	})

	test('Mobile: sidebar auto-closes on component select', async ({ page }, testInfo) => {
		const w = page.viewportSize()?.width || 1200
		if (w > 768) {
			testInfo.skip()
			return
		}

		await page.goto('/')
		await expect(page.locator('.toolbar h2')).toBeVisible({ timeout: 10000 })

		// Open sidebar
		await page.locator('.sidebar-toggle').click()
		await page.waitForTimeout(400)
		await expect(page.locator('.sidebar')).toHaveClass(/open/)

		// Select a component
		await page.locator('.comp-item').filter({ hasText: 'Badge' }).click()
		await page.waitForTimeout(400)

		// Sidebar should auto-close
		await expect(page.locator('.sidebar')).not.toHaveClass(/open/)
		await expect(page.locator('.toolbar h2')).toHaveText('Badge')
	})

	test('Mobile: props pane stacks below preview', async ({ page }, testInfo) => {
		const w = page.viewportSize()?.width || 1200
		if (w > 768) {
			testInfo.skip()
			return
		}

		await ensureIDEReady(page)
		await selectComponent(page, 'Button')

		// Props pane should be visible
		const propsPane = page.locator('.props-pane')
		await expect(propsPane).toBeVisible()

		// Verify stacked layout: props below preview
		const previewBox = await page.locator('.preview-pane').boundingBox()
		const propsBox = await propsPane.boundingBox()
		if (previewBox && propsBox) {
			expect(propsBox.y).toBeGreaterThanOrEqual(previewBox.y)
		}
	})

	test('Desktop: sidebar toggle is hidden', async ({ page }, testInfo) => {
		const w = page.viewportSize()?.width || 1200
		if (w <= 768) {
			testInfo.skip()
			return
		}

		await ensureIDEReady(page)

		// Toggle should NOT be visible on desktop
		await expect(page.locator('.sidebar-toggle')).toBeHidden()

		// Sidebar should be directly visible
		await expect(page.locator('.sidebar')).toBeVisible()
	})
})

// ────────────────────────────────────────────────────────────
// Component Renderer E2E (visual regression)
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

// ────────────────────────────────────────────────────────────
// Theme Switching
// ────────────────────────────────────────────────────────────

test.describe('Master IDE - Theme Switching', () => {
	test('Theme switcher changes body class', async ({ page }) => {
		await ensureIDEReady(page)

		await page.locator('.theme-select').selectOption('dark')
		await expect(page.locator('body')).toHaveClass('theme-dark')

		await page.locator('.theme-select').selectOption('light')
		await expect(page.locator('body')).toHaveClass('theme-light')

		await page.locator('.theme-select').selectOption('auto')
		await expect(page.locator('body')).toHaveClass(/theme-(dark|light)/)
	})
})

// ────────────────────────────────────────────────────────────
// Props Editor
// ────────────────────────────────────────────────────────────

test.describe('Master IDE - Props Editor', () => {
	test('Props editor updates live preview', async ({ page }) => {
		await ensureIDEReady(page)
		await selectComponent(page, 'Alert')

		const titleInput = page.locator('.prop-input[type="text"]').first()
		await titleInput.fill('E2E Test Title')

		const preview = page.locator('.preview-canvas')
		await expect(preview).toContainText('E2E Test Title')
	})

	test('Reset button restores default props', async ({ page }) => {
		await ensureIDEReady(page)
		await selectComponent(page, 'Alert')

		const titleInput = page.locator('.prop-input[type="text"]').first()
		const originalValue = await titleInput.inputValue()
		await titleInput.fill('Modified Title')

		await page.locator('.btn-reset').click()
		const resetValue = await titleInput.inputValue()
		expect(resetValue).toBe(originalValue)
	})

	test('Variant selection updates props', async ({ page }) => {
		await ensureIDEReady(page)
		await selectComponent(page, 'Alert')

		const errPill = page.locator('.variant-pill').filter({ hasText: 'Err' })
		await errPill.click()
		await page.waitForTimeout(200)

		const variantSelect = page.locator('.prop-select').first()
		const selectedValue = await variantSelect.inputValue()
		expect(selectedValue).toBe('err')
	})
})

// ────────────────────────────────────────────────────────────
// Search
// ────────────────────────────────────────────────────────────

test.describe('Master IDE - Search', () => {
	test('Search filters components in sidebar', async ({ page }) => {
		await ensureIDEReady(page)

		const viewportWidth = page.viewportSize()?.width || 1200
		const isMobile = viewportWidth <= 768

		if (isMobile) {
			await page.locator('.sidebar-toggle').click()
			await page.waitForTimeout(400)
		}

		const searchInput = page.locator('.search-box input')
		await searchInput.fill('Button')

		const visibleItems = page.locator('.comp-item')
		await expect(visibleItems).toHaveCount(1)
		await expect(visibleItems.first()).toContainText('Button')

		await searchInput.fill('')
		const allItems = page.locator('.comp-item')
		const count = await allItems.count()
		expect(count).toBeGreaterThan(5)
	})
})

// ────────────────────────────────────────────────────────────
// v1.5.0 — Deep Linking, Active Page, Unique Variants, Light Code Pane
// ────────────────────────────────────────────────────────────

test.describe('v1.5.0 — Deep-Linked Category URLs', () => {
	test('Button page loads at /uk/Actions/Button.html', async ({ page }) => {
		await page.goto('/uk/Actions/Button.html')
		await expect(page.locator('.toolbar h2')).toHaveText('Button', { timeout: 10000 })
	})

	test('Navigation between categories works via sidebar', async ({ page }) => {
		await page.goto('/uk/Actions/Button.html')
		await expect(page.locator('.toolbar h2')).toHaveText('Button', { timeout: 10000 })

		// Navigate to Alert (Feedback category)
		await selectComponent(page, 'Alert')
		await expect(page.locator('.toolbar h2')).toHaveText('Alert')
		// URL should contain category
		await expect(page).toHaveURL(/\/Feedback\/Alert\.html/)
	})

	test('Variant hash fragment works with category URL', async ({ page }) => {
		await page.goto('/uk/Actions/Button.html#var2')
		await expect(page.locator('.toolbar h2')).toHaveText('Button', { timeout: 10000 })
		// Second variant should be active
		const pills = page.locator('.variant-pill:not(.add-btn)')
		await expect(pills.nth(1)).toHaveClass(/active/)
	})
})

test.describe('v1.5.0 — Active Page on Refresh', () => {
	test('Active component highlighted in sidebar after page load', async ({ page }) => {
		await page.goto('/uk/Actions/Button.html')
		await expect(page.locator('.toolbar h2')).toHaveText('Button', { timeout: 10000 })

		const viewportWidth = page.viewportSize()?.width || 1200
		if (viewportWidth <= 768) {
			await page.locator('.sidebar-toggle').click()
			await page.waitForTimeout(400)
		}

		// Button should be active in sidebar
		const activeItem = page.locator('.comp-item.active')
		await expect(activeItem).toHaveText(/Button/)
	})

	test('Active component stays highlighted after F5 reload', async ({ page }) => {
		await page.goto('/uk/Feedback/Alert.html')
		await expect(page.locator('.toolbar h2')).toHaveText('Alert', { timeout: 10000 })

		// Navigate to Toggle
		await selectComponent(page, 'Toggle')
		await expect(page.locator('.toolbar h2')).toHaveText('Toggle')

		// Reload
		await page.reload()
		await expect(page.locator('.toolbar h2')).toHaveText('Toggle', { timeout: 10000 })

		const viewportWidth = page.viewportSize()?.width || 1200
		if (viewportWidth <= 768) {
			await page.locator('.sidebar-toggle').click()
			await page.waitForTimeout(400)
		}

		// Toggle should be active
		const activeItem = page.locator('.comp-item.active')
		await expect(activeItem).toHaveText(/Toggle/)
	})
})

test.describe('v1.5.0 — Unique Variant Names', () => {
	test('Button variants have no duplicate names', async ({ page }) => {
		await page.goto('/uk/Actions/Button.html')
		await expect(page.locator('.toolbar h2')).toHaveText('Button', { timeout: 10000 })

		const pills = page.locator('.variant-pill:not(.add-btn)')
		const count = await pills.count()
		const names = []
		for (let i = 0; i < count; i++) {
			names.push((await pills.nth(i).innerText()).trim())
		}
		const uniqueNames = new Set(names)
		expect(uniqueNames.size).toBe(names.length)
	})

	test('Outline variant has label-based name, not variant-based', async ({ page }) => {
		await page.goto('/uk/Actions/Button.html')
		await expect(page.locator('.toolbar h2')).toHaveText('Button', { timeout: 10000 })

		// Should have an "Outline" pill (from label), not a duplicate "Primary"
		const outlinePill = page.locator('.variant-pill').filter({ hasText: 'Outline' })
		await expect(outlinePill).toBeVisible()
	})
})

test.describe('v1.5.0 — Light Theme Code Pane', () => {
	test('Code pane adapts to light theme', async ({ page }) => {
		await page.goto('/uk/Feedback/Alert.html')
		await expect(page.locator('.toolbar h2')).toHaveText('Alert', { timeout: 10000 })

		// Switch to light theme
		await page.locator('.theme-select').selectOption('light')
		await page.waitForTimeout(300)

		// Code pane should have a light background (not dark #1e1e1e)
		const codePaneBg = await page
			.locator('.code-pane')
			.evaluate((el) => getComputedStyle(el).backgroundColor)
		// Light bg should not be very dark (rgb values should be > 200)
		const match = codePaneBg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
		if (match) {
			const [, r, g, b] = match.map(Number)
			expect(r).toBeGreaterThan(200)
			expect(g).toBeGreaterThan(200)
			expect(b).toBeGreaterThan(200)
		}
	})

	test('Code tabs have readable contrast in light theme', async ({ page }) => {
		await page.goto('/uk/Feedback/Alert.html')
		await expect(page.locator('.toolbar h2')).toHaveText('Alert', { timeout: 10000 })

		await page.locator('.theme-select').selectOption('light')
		await page.waitForTimeout(300)

		// Active tab text should be dark (readable)
		const activeTabColor = await page
			.locator('.code-tab.active')
			.evaluate((el) => getComputedStyle(el).color)
		const match = activeTabColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
		if (match) {
			const [, r, g, b] = match.map(Number)
			// Dark text: values should be < 100
			expect(r).toBeLessThan(100)
			expect(g).toBeLessThan(100)
			expect(b).toBeLessThan(100)
		}
	})
})
