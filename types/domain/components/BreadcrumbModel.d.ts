/**
 * @typedef {Object} BreadcrumbItem
 * @property {string} label  - Human-readable display name (e.g. "Sandbox", "Кнопка")
 * @property {string} path   - URL-safe segment (e.g. "sandbox", "button")
 */
/**
 * @typedef {Object} BreadcrumbData
 * @property {BreadcrumbItem[]} [items]
 * @property {string} [separator]
 */
/**
 * Model-as-Schema for Breadcrumb navigation.
 *
 * Each breadcrumb item has a `label` (display) and a `path` (URL segment).
 * The full path is the join of all segments, mirroring both:
 *   - Web URL:  /sandbox/button/export
 *   - FS data:  data/sandbox/button/export/index.yaml
 *   - CLI nav:  🏖 Sandbox › Button › Export
 *
 * This is the universal "where am I?" model for any OLMUI application.
 *
 * ESC/Back = pop() one item. Empty stack = app exit.
 * Ctrl+C   = always exit (adapter responsibility).
 */
export class BreadcrumbModel {
    static items: {
        help: string;
        type: string;
        default: never[];
    };
    static separator: {
        help: string;
        default: string;
        type: string;
    };
    /**
     * Reconstruct a BreadcrumbModel from a URL path string.
     *
     * @param {string} urlPath - e.g. "/sandbox/button" or "sandbox/button"
     * @param {Record<string,string>} [labelMap={}] - Optional map of path→label for display names.
     * @returns {BreadcrumbModel}
     */
    static fromPath(urlPath: string, labelMap?: Record<string, string>): BreadcrumbModel;
    /**
     * Create a URL-safe slug from any label.
     * Handles Unicode (Cyrillic, etc.) by lowercasing and replacing spaces/special chars.
     *
     * @param {string} label
     * @returns {string}
     */
    static slugify(label: string): string;
    /**
     * @param {BreadcrumbData} [data]
     */
    constructor(data?: BreadcrumbData);
    /** @type {BreadcrumbItem[]} */ items: BreadcrumbItem[];
    /** @type {string} */ separator: string;
    /**
     * Push a new level onto the navigation stack.
     *
     * @param {string} label - Display label (e.g. "Button", "Кнопка")
     * @param {string} [path] - URL segment. Auto-slugified from label if omitted.
     * @returns {this}
     */
    push(label: string, path?: string): this;
    /**
     * Pop the last level from the navigation stack.
     *
     * @returns {BreadcrumbItem|undefined} The removed item, or undefined if stack was empty.
     */
    pop(): BreadcrumbItem | undefined;
    /**
     * Whether the user can navigate back (stack has > 0 items after pop).
     *
     * @returns {boolean}
     */
    canGoBack(): boolean;
    /**
     * Navigate to a specific depth by truncating the stack.
     *
     * @param {number} depth - Target depth (0 = root only).
     * @returns {this}
     */
    navigateTo(depth: number): this;
    /**
     * Full URL-style path: `/sandbox/button/export`
     * @returns {string}
     */
    get path(): string;
    /**
     * Just the path segments array: `['sandbox', 'button', 'export']`
     * @returns {string[]}
     */
    get segments(): string[];
    /**
     * Just the display labels: `['Sandbox', 'Button', 'Export']`
     * @returns {string[]}
     */
    get labels(): string[];
    /**
     * Current (last) breadcrumb item.
     * @returns {BreadcrumbItem|undefined}
     */
    get current(): BreadcrumbItem | undefined;
    /**
     * Current navigation depth (0 = no items).
     * @returns {number}
     */
    get depth(): number;
    /**
     * Display string: `Sandbox › Button › Export`
     * @returns {string}
     */
    toString(): string;
    /**
     * Serialize to URL query param value: `sandbox/button/export`
     * @returns {string}
     */
    toURL(): string;
    /**
     * Filesystem data path: `data/sandbox/button/export/index.yaml`
     * @param {string} [filename='index.yaml'] - Leaf filename.
     * @returns {string}
     */
    toDataPath(filename?: string): string;
    /**
     * Yields a log intent with the current breadcrumb path.
     * This is a "display-only" run — it shows the navigation state.
     */
    run(): AsyncGenerator<any, {
        type: string;
        data: {
            path: string;
            items: BreadcrumbItem[];
            depth: number;
        };
    }, unknown>;
}
export type BreadcrumbItem = {
    /**
     * - Human-readable display name (e.g. "Sandbox", "Кнопка")
     */
    label: string;
    /**
     * - URL-safe segment (e.g. "sandbox", "button")
     */
    path: string;
};
export type BreadcrumbData = {
    items?: BreadcrumbItem[] | undefined;
    separator?: string | undefined;
};
