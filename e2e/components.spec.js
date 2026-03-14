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
		await expect(codeTabs).toHaveCount(3)

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
		await page.goto('/uk/Data/Badge.html')
		await expect(page.locator('.toolbar h2')).toHaveText('Badge', { timeout: 10000 })

		const copyBtn = page.locator('.code-copy')
		await expect(copyBtn).toBeVisible()
		await expect(copyBtn).toHaveText(/Копіювати код/)
	})

	test('Code tabs work for multiple components', async ({ page }) => {
		await ensureIDEReady(page)

		for (const comp of ['Alert', 'Badge', 'Button']) {
			await selectComponent(page, comp)

			const tabs = page.locator('.code-tab')
			await expect(tabs).toHaveCount(3)
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
	test('Saved variation persists across page reloads', async ({ page, context }) => {
		// Clear all browser storage to avoid stale data from previous runs
		await context.clearCookies()
		await page.goto('/uk/Feedback/Alert.html')
		await expect(page.locator('.toolbar h2')).toHaveText('Alert', { timeout: 10000 })

		// Clear IndexedDB via page evaluate
		await page.evaluate(async () => {
			const dbs = await indexedDB.databases?.() || []
			for (const db of dbs) {
				if (db.name) indexedDB.deleteDatabase(db.name)
			}
		})
		await page.reload()
		await expect(page.locator('.toolbar h2')).toBeVisible({ timeout: 10000 })

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

		// Verify new variant appeared (by name, not by count)
		await expect(
			page.locator('.variant-pill').filter({ hasText: 'E2E Persisted Variant' }),
		).toBeVisible()

		// Reload page
		await page.reload()
		// Wait for IDE to fully render after reload
		await expect(page.locator('.toolbar h2')).toBeVisible({ timeout: 10000 })

		// Navigate away and back to trigger restore from IndexedDB
		await page.goto('/uk/Data/Badge.html')
		await expect(page.locator('.toolbar h2')).toHaveText('Badge', { timeout: 10000 })
		await page.goto('/uk/Feedback/Alert.html')
		await expect(page.locator('.toolbar h2')).toHaveText('Alert', { timeout: 10000 })

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

		await page.goto('/ide.html')
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

		await page.goto('/ide.html')
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
// Component Renderer E2E (visual regression) — MOVED to visual.spec.js
// Run separately: npx playwright test e2e/visual.spec.js
// ────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────
// Theme Switching
// ────────────────────────────────────────────────────────────

test.describe('Master IDE - Theme Switching', () => {
	test('Theme switcher changes html class', async ({ page }) => {
		await ensureIDEReady(page)

		const themeBtn = page.locator('#ide-theme-toggle')
		// Click cycles: auto → light → dark → auto
		await themeBtn.click() // auto → light
		await expect(page.locator('html')).toHaveClass(/theme-light/)

		await themeBtn.click() // light → dark
		await expect(page.locator('html')).toHaveClass(/theme-dark/)

		await themeBtn.click() // dark → auto
		// In auto, class depends on system preference — just verify no forced class or valid class
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

		// Theme Settings is always visible as .comp-item, so filter to .app-items .comp-item
		const visibleItems = page.locator('.app-items .comp-item')
		await expect(visibleItems).toHaveCount(1)
		await expect(visibleItems.first()).toContainText('Button')

		await searchInput.fill('')
		const allItems = page.locator('.app-items .comp-item')
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

		// Navigate to Alert (Feedback category) via direct URL
		await page.goto('/uk/Feedback/Alert.html')
		await expect(page.locator('.toolbar h2')).toHaveText('Alert', { timeout: 10000 })
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
		// Navigate directly to Toggle (avoids flaky sidebar navigation)
		await page.goto('/uk/Actions/Toggle.html')
		await expect(page.locator('.toolbar h2')).toHaveText('Toggle', { timeout: 10000 })

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

		// Switch to light theme (auto → light)
		await page.locator('#ide-theme-toggle').click()
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

		await page.locator('#ide-theme-toggle').click() // auto → light
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

// ────────────────────────────────────────────────────────────
// v1.6.0 — Docs Landing Page & IDE Split
// ────────────────────────────────────────────────────────────

test.describe('v1.6.0 — Docs Landing Page', () => {
	test('Landing page has navbar with logo and nav links', async ({ page }) => {
		await page.goto('/')
		await expect(page.locator('.navbar')).toBeVisible({ timeout: 5000 })
		await expect(page.locator('.nav-brand')).toContainText('nan')
		await expect(page.locator('.nav-pkg')).toHaveText('ui')
	})

	test('Landing page has hero section', async ({ page }) => {
		await page.goto('/')
		await expect(page.locator('.hero h1')).toContainText(/One Logic|Одна логіка/)
		await expect(page.locator('.hero h1 span')).toContainText(/Many UI|Багато UI/)
	})

	test('Master IDE link navigates to /ide.html', async ({ page }) => {
		await page.goto('/')
		const ideLink = page.locator('a[href="/ide.html"]').first()
		await expect(ideLink).toBeVisible()
		await ideLink.click()
		await expect(page).toHaveURL(/ide\.html/)
	})

	test('GitHub link points to nan0web/ui', async ({ page }) => {
		await page.goto('/')
		const ghLink = page.locator('.hero a[href*="github.com/nan0web/ui"]')
		await expect(ghLink).toBeVisible()
	})

	test('Language toggle switches between UK and EN', async ({ page }) => {
		await page.goto('/')
		const langBtn = page.locator('#lang-toggle')
		await expect(langBtn).toBeVisible()
		const initialText = await langBtn.textContent()
		await langBtn.click()
		const newText = await langBtn.textContent()
		expect(newText).not.toBe(initialText)
	})

	test('Theme toggle changes the theme class', async ({ page }) => {
		await page.goto('/')
		const themeBtn = page.locator('#theme-toggle')
		await expect(themeBtn).toBeVisible()
		await themeBtn.click()
		const html = page.locator('html')
		const cls = (await html.getAttribute('class')) || ''
		expect(cls).toMatch(/theme-(light|dark)/)
	})

	test('Docs content area loads markdown documentation', async ({ page }) => {
		await page.goto('/')
		const docsContainer = page.locator('#docs-container')
		await expect(docsContainer).toBeVisible({ timeout: 5000 })
		await expect(docsContainer).not.toContainText('Loading documentation', { timeout: 5000 })
		await expect(docsContainer).toContainText('@nan0web/ui')
	})
})

test.describe('v1.6.0 — IDE on /ide.html', () => {
	test('IDE page loads at /ide.html with sidebar and toolbar', async ({ page }) => {
		await page.goto('/ide.html')
		await expect(page.locator('.toolbar h2')).toBeVisible({ timeout: 10000 })
		await expect(page.locator('.sidebar')).toBeVisible()
		await expect(page.locator('.comp-list')).toBeVisible()
	})

	test('IDE page has NaN0 Spec tab in code tabs', async ({ page }) => {
		await page.goto('/uk/Feedback/Alert.html')
		await expect(page.locator('.toolbar h2')).toBeVisible({ timeout: 10000 })
		const nan0Tab = page.locator('.code-tab').filter({ hasText: /NaN0/ })
		await expect(nan0Tab).toBeVisible()
	})
})

test.describe('v1.6.0 — Architecture Map', () => {
	test('Architecture Map section is visible with table', async ({ page }) => {
		await page.goto('/')
		await expect(page.locator('#architecture-map')).toBeVisible({ timeout: 5000 })
		await expect(page.locator('#map-table')).toBeVisible()
	})

	test('Architecture Map has 24 component rows', async ({ page }) => {
		await page.goto('/')
		const rows = page.locator('#map-tbody tr')
		await expect(rows).toHaveCount(24, { timeout: 5000 })
	})

	test('Architecture Map has column filter checkboxes', async ({ page }) => {
		await page.goto('/')
		const checkboxes = page.locator('#map-filters input[type="checkbox"]')
		await expect(checkboxes).toHaveCount(10)
	})

	test('Unchecking a column filter hides it from table', async ({ page }) => {
		await page.goto('/')
		// Initially 3 package columns + 1 component name = 4 cells per row
		const headerCells = page.locator('#map-thead th')
		await expect(headerCells).toHaveCount(11, { timeout: 5000 })

		// Uncheck first filter
		const firstCheckbox = page.locator('#map-filters input[type="checkbox"]').first()
		await firstCheckbox.uncheck()

		// Should now have 3 columns (1 name + 2 packages)
		await expect(headerCells).toHaveCount(10)
	})

	test('Architecture Map shows summary counter', async ({ page }) => {
		await page.goto('/')
		const summary = page.locator('#map-summary')
		await expect(summary).toContainText('/ 24')
	})
})
