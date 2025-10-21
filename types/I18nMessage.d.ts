/** @typedef {(key: string, params?: Record<string, any>) => string} TranslateFunction */
/**
 * Internationalized Message class
 * Extends base Message with translation support
 */
export default class I18nMessage extends Message {
    /**
     * Default replacer function for translation parameters
     * @param {string} key - Translation key with placeholders like {{name}}
     * @param {Record<string, any>} [params] - Parameters to replace placeholders
     * @returns {string} - Translated string with replaced parameters
     */
    static Replacer: (key: string, params?: Record<string, any> | undefined) => string;
    /**
     * Create I18nMessage from various inputs
     * @param {any} input - Input to create message from
     * @returns {I18nMessage} - I18nMessage instance
     */
    static from(input: any): I18nMessage;
    /**
     * Create a new I18nMessage instance
     * @param {object} input - Input configuration
     * @param {any} [input.body] - Message body.
     * @param {Date} [input.time] - Created at time.
     * @param {TranslateFunction} [input.t] - Function for translations in current locale.
     */
    constructor(input?: {
        body?: any;
        time?: Date | undefined;
        t?: TranslateFunction | undefined;
    });
    /**
     * Translate a key with given parameters
     * @param {string} key - Translation key
     * @param {Record<string, any>} [params] - Parameters for placeholder replacement
     * @returns {string} - Translated and formatted message
     */
    t(key: string, params?: Record<string, any> | undefined): string;
    #private;
}
export type TranslateFunction = (key: string, params?: Record<string, any>) => string;
import Message from "./Message.js";
