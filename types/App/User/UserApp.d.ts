export default UserApp;
/**
 * UserApp requires user name and shows Welcome view.
 * If user.name is provided in command input, ignores user input.
 * User can change user data to see another Welcome view.
 */
declare class UserApp extends CoreApp {
    /** @type {CommandMessage} Starting command parsed from argv */
    startCommand: CommandMessage;
    /**
     * Set user data from params.
     * @param {CommandMessage} cmd - Command message with user data
     * @param {UserUI} ui - UI instance
     * @returns {Promise<{ message: string }>} Welcome message
     */
    setUser(cmd: CommandMessage, ui: UserUI): Promise<{
        message: string;
    }>;
    /**
     * Show welcome message for current user.
     * @param {CommandMessage} cmd - Command message
     * @param {UserUI} ui - UI instance
     * @returns {Promise<string[][]>} Welcome view output
     */
    welcome(cmd: CommandMessage, ui: UserUI): Promise<string[][]>;
    user: User | undefined;
}
import CoreApp from "../Core/CoreApp.js";
import { CommandMessage } from "./Command/index.js";
import UserUI from "./UserUI.js";
import User from "../../Model/User/User.js";
