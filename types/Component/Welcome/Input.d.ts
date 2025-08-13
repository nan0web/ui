export default WelcomeInput;
/**
 * Represents input data for the Welcome component.
 * Holds user data to display in the welcome message.
 */
declare class WelcomeInput {
    /**
     * Creates a WelcomeInput instance from the given props.
     * @param {WelcomeInput|object} props - The properties to create from
     * @returns {WelcomeInput} A WelcomeInput instance
     */
    static from(props?: WelcomeInput | object): WelcomeInput;
    /**
     * Creates a new WelcomeInput instance.
     * @param {object} props - Welcome input properties
     * @param {Model.User|object} [props.user=new Model.User()] - User data
     */
    constructor(props?: {
        user?: Model.User | object;
    });
    /** @type {Model.User} User data for welcome message */
    user: Model.User;
    /**
     * Checks if the input is empty (no user data).
     * @returns {boolean} True if user data is empty, false otherwise
     */
    get empty(): boolean;
    /**
     * Converts the input to a string representation.
     * @returns {string} String representation of the WelcomeInput
     */
    toString(): string;
}
