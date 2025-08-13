declare const UserUI_base: typeof import("../Core/UI.js").default;
/**
 * UserUI connects UserApp and View.
 * It asks user for name if not provided in command input.
 * Allows user to change user data to see another Welcome view.
 */
export default class UserUI extends UserUI_base {
    /**
     * Convert raw input to CommandMessage array.
     * If user.name provided in rawInput, use it directly.
     * Otherwise ask user for name.
     * @param {any} rawInput - Raw input to convert
     * @returns {Command.Message[]} Array of command messages
     */
    convertInput(rawInput: any): Command.Message[];
}
export {};
