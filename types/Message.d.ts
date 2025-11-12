/**
 * @typedef {object} MessageInput
 * @property {Record<string, any>} [input.head] - Message head.
 * @property {any} [input.body] - Message body.
 * @property {Date} [input.time] - Created at time.
 */
/**
 * Base Message class
 */
export default class Message {
    /**
     * Body class defines the meta data for the body object.
     * @todo write the informational description
     * static ERRORS = Record<string, string> - Errors for translations collection.
     * static {field} = Record<string, any> - HTML-like element attributes such as minlength,
     *   maxlength, min, max, step, etc., that can be used by UIs to render proper
     *   editable components for the data.
     *
     * static {field}Validation = (value) => string | string[] | true
     */
    static Body: {
        new (): {};
    };
    /**
     * Create Message instance from body
     * @param {any} input - body to create message from
     * @returns {Message} - Message instance
     */
    static from(input: any): Message;
    /**
     * Parse input according to a Body schema.
     * Handles alias mapping, default values and options validation.
     *
     * @param {Record<string, any>} input - raw input object
     * @param {Record<string, any>} Body  - schema object where each key maps to a config
     * @returns {Record<string, any>} - parsed result
     * @throws {Error} - when provided value is not in allowed options
     */
    static parseBody(input: Record<string, any>, Body: Record<string, any>): Record<string, any>;
    /**
     * Create a new Message instance
     * @param {MessageInput} input
     */
    constructor(input?: MessageInput);
    /** @type {Record<string, any>} */
    head: Record<string, any>;
    /** @type {any} */
    body: any;
    get empty(): boolean;
    /**
     * Returns true if message is valid.
     * @returns {boolean}
     */
    get isValid(): boolean;
    /**
     * Get message creation time
     * @returns {Date}
     */
    get time(): Date;
    /**
     * Validates body and its fields and returns errors for every field (key) as string[].
     * Schema format:
     * @returns {Record<string, string[]>}
     */
    getErrors(): Record<string, string[]>;
    /**
     * Convert message to object representation
     * @returns {object} - Object with body and time properties
     */
    toObject(): object;
    /**
     * Convert message to string representation
     * @returns {string} - String with timestamp and body
     */
    toString(): string;
    #private;
}
export type MessageInput = {
    /**
     * - Message head.
     */
    head?: Record<string, any> | undefined;
    /**
     * - Message body.
     */
    body?: any;
    /**
     * - Created at time.
     */
    time?: Date | undefined;
};
