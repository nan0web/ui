/**
 * SnapshotAuditor — Zero-Hallucination Snapshot Validation (Model-as-Schema v2).
 * Parses snapshots without evaluating the app logic and detects artifacts.
 *
 * @extends {AuditorModel}
 */
export class SnapshotAuditor {
    static alias: string;
    static dir: {
        type: string;
        help: string;
        positional: boolean;
        default: string;
    };
    static data: {
        type: string;
        help: string;
        default: string;
    };
    /** @type {Object<string, string>} Messages for UI */
    static UI: {
        [x: string]: string;
    };
    /** @type {string[]} Common UI components that can be empty in render */
    static EXEMPT_EMPTY: string[];
    /** @type {string[]} Critical JS artifacts to detect in snapshots */
    static ARTIFACTS: string[];
    /** @type {string[]} Words to ignore across all languages */
    static EXEMPT_WORDS: string[];
    /** @type {RegExp} Pattern for suspicious filenames */
    static SUSPICIOUS_FILENAME: RegExp;
    /** @type {number} Minimum filename length */
    static MIN_FILENAME_LENGTH: number;
    /**
     * Extracts all valid words from an object into a Set.
     * @param {any} obj Node to extract from.
     * @param {Set<string>} set Set to populate.
     */
    static extractWords(obj: any, set: Set<string>): void;
    /**
     * Scans data directories to build a word set for each language.
     * @param {any} fsDb FileSystem DB.
     * @param {string} data
     * @returns {Promise<Record<string, Set<string>>>}
     */
    static buildDictionaries(fsDb: any, data?: string): Promise<Record<string, Set<string>>>;
    /**
     * Inspects a single snapshot text.
     * @param {string} content Content of the file.
     * @param {string} locale Locale (uk, en).
     * @param {string} filename Name of the file.
     * @param {import('@nan0web/i18n').TFunction} t Translate function.
     * @param {Record<string, Set<string>>} [dictionaries=undefined] Loaded dictionaries for mutual exclusion check.
     * @returns {{ score: number, errors: string[] }}
     */
    static inspectText(content: string, locale: string, filename: string, t: any, dictionaries?: Record<string, Set<string>>): {
        score: number;
        errors: string[];
    };
    /**
     * Recursively checks a parsed node.
     * @param {any} node Node.
     * @param {string} path JSON path.
     * @param {{ locale: string, errors: string[], t: import('@nan0web/i18n').TFunction, dictionaries?: Record<string, Set<string>> }} context Context.
     */
    static checkNode(node: any, path: string, context: {
        locale: string;
        errors: string[];
        t: any;
        dictionaries?: Record<string, Set<string>>;
    }): void;
    /**
     * Checks a string node.
     * @param {string} str String.
     * @param {string} path Path.
     * @param {{ locale: string, errors: string[], t: import('@nan0web/i18n').TFunction, dictionaries?: Record<string, Set<string>> }} context Context.
     */
    static checkString(str: string, path: string, context: {
        locale: string;
        errors: string[];
        t: any;
        dictionaries?: Record<string, Set<string>>;
    }): void;
    /**
     * @param {Partial<SnapshotAuditor> | Record<string, any>} [data={}]
     * @param {Partial<import('@nan0web/types').ModelOptions>} [options={}]
     */
    constructor(data?: Partial<SnapshotAuditor> | Record<string, any>, options?: Partial<import("@nan0web/types").ModelOptions>);
    /** @type {import('../../index.js').ModelAsAppOptions} */
    _: import("../../index.js").ModelAsAppOptions;
    /** @type {string} Target directory to audit */ dir: string;
    /** @type {string} Directory to scan for dictionaries */ data: string;
    /**
     * Run the snapshot audit inside the target directory.
     * @returns {AsyncGenerator<import('@nan0web/ui').Intent, any, any>}
     */
    run(): AsyncGenerator<import("@nan0web/ui").Intent, any, any>;
}
export default SnapshotAuditor;
