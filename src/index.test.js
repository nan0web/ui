import { describe, expect, it } from "vitest"
import { App } from "@nan0web/ui"

describe("App", () => {
	it("should be defined", () => {
		expect(App).toBeDefined()
		expect(App.Core).toBeDefined()
		expect(App.User).toBeDefined()
		expect(App.Command).toBeDefined()
		expect(App.Scenario).toBeDefined()
		expect(App.UI).toBeDefined()
	})
})
