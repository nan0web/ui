export default User;
/**
 * Represents a user with name and email properties.
 */
declare class User {
    /**
     * Creates a User instance from the given props.
     * @param {User|object|string} props - The properties to create from
     * @returns {User} A User instance
     */
    static from(props: User | object | string): User;
    /**
     * Creates a new User instance.
     * @param {object|string} props - User properties or name string
     * @param {string} [props.name=""] - User name
     * @param {string} [props.email=""] - User email
     */
    constructor(props?: object | string);
    /** @type {string} User name */
    name: string;
    /** @type {string} User email */
    email: string;
    /**
     * Checks if user data is empty (no name and no email).
     * @returns {boolean} True if both name and email are empty, false otherwise
     */
    get empty(): boolean;
    /**
     * Converts user to string representation.
     * @returns {string} User name and email (if exists)
     */
    toString(): string;
}
