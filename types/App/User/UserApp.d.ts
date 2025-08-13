export default UserApp;
/**
 * UserApp requires user name and shows Welcome view.
 * If user.name is provided in command input, ignores user input.
 * User can change user data to see another Welcome view.
 */
declare class UserApp extends CoreApp {
    /**
     * Set user data from params.
     * @param {Command.Message} cmd - Command message with user data
     * @param {UserUI} ui - UI instance
     * @returns {Promise<{ message: string }>} Welcome message
     */
    setUser(cmd: Command.Message, ui: UserUI): Promise<{
        message: string;
    }>;
    /**
     * Show welcome message for current user.
     * @param {Command.Message} cmd - Command message
     * @param {UserUI} ui - UI instance
     * @returns {Promise<string[][]>} Welcome view output
     */
    welcome(cmd: Command.Message, ui: UserUI): Promise<string[][]>;
    user: User | undefined;
}
import CoreApp from "../Core/CoreApp.js";
import UserUI from "./UserUI.js";
import User from "../../Model/User/User.js";
