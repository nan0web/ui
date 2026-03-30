import { defineConfig, devices } from '@playwright/test'

const isSlow = process.env.E2E_SLOW === '1'

const fastProjects = [
	{
		name: 'Desktop (1200px)',
		use: { viewport: { width: 1200, height: 800 } },
	},
]

const allProjects = [
	{
		name: 'Mobile Setup (375px)',
		use: { viewport: { width: 375, height: 667 } },
	},
	{
		name: 'Tablet Portrait (768px)',
		use: { viewport: { width: 768, height: 1024 } },
	},
	{
		name: 'Tablet Landscape (1024px)',
		use: { viewport: { width: 1024, height: 768 } },
	},
	{
		name: 'Standard Desktop (1200px)',
		use: { viewport: { width: 1200, height: 800 } },
	},
	{
		name: 'Full HD Desktop (1920px)',
		use: { viewport: { width: 1920, height: 1080 } },
	},
]

export default defineConfig({
	testDir: './test/e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	use: {
		baseURL: 'http://localhost:4270',
		trace: 'on-first-retry',
	},

	projects: isSlow ? allProjects : fastProjects,

	/* Run local dev server before starting the tests */
	webServer: {
		command: 'pnpm docs:dev',
		url: 'http://localhost:4270',
		reuseExistingServer: !process.env.CI,
		timeout: 10000,
	},
})
