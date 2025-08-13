/**
 * Abstract Scenario class to test app logic.
 * Scenarios run input commands and verify output.
 */
export default class Scenario {
    /**
     * Creates a new Scenario instance.
     * @param {App.Core.App} app - App instance to run scenarios against
     * @throws {TypeError} If app is not an App.Core.App instance
     */
    constructor(app: App.Core.App);
    /** @type {App.Core.App} The app to run scenarios against */
    app: App.Core.App;
    /**
     * Run scenario with input commands and expected output.
     * @param {Array<any[]>} inputCommands - Array of command arrays
     * @param {Array<any>} expectedOutputs - Expected outputs for each command
     * @returns {Promise<boolean>} True if all outputs match expected
     */
    run(inputCommands: Array<any[]>, expectedOutputs: Array<any>): Promise<boolean>;
}
