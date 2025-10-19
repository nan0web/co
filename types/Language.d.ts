/**
 * Language class for handling localization data
 * Stores language information including name, icon, code, and locale
 */
export default class Language {
    /**
     * Factory method to create Language instance
     * @param {any} input - Language instance or data for constructor
     * @returns {Language} - Language instance
     */
    static from(input: any): Language;
    /**
     * Create a new Language instance
     * @param {object} [input={}] - Language properties
     * @param {string} [input.name=""] - Language name
     * @param {string} [input.icon=""] - Language icon identifier
     * @param {string} [input.code=""] - ISO 639-1 language code (e.g. "en", "uk")
     * @param {string} [input.locale=""] - Locale identifier (e.g. "en-US", "uk-UA")
     */
    constructor(input?: {
        name?: string | undefined;
        icon?: string | undefined;
        code?: string | undefined;
        locale?: string | undefined;
    });
    /** @type {string} */
    name: string;
    /** @type {string} */
    icon: string;
    /** @type {string} */
    code: string;
    /** @type {string} */
    locale: string;
    /**
     * The stringified version of the language.
     * @returns {string}
     */
    toString(): string;
}
