/**
 * Base Message class
 */
export default class Message {
    /**
     * Create Message instance from body
     * @param {any} input - body to create message from
     * @returns {Message} - Message instance
     */
    static from(input: any): Message;
    /**
     * Create a new Message instance
     * @param {object} input
     * @param {Record<string, any>} [input.head] - Message head.
     * @param {any} [input.body] - Message body.
     * @param {Date} [input.time] - Created at time.
     */
    constructor(input?: {
        head?: Record<string, any> | undefined;
        body?: any;
        time?: Date | undefined;
    });
    /** @type {Record<string, any>} */
    head: Record<string, any>;
    /** @type {any} */
    body: any;
    /**
     * Returns true if message is valid.
     * @returns {boolean}
     */
    get isValid(): boolean;
    /**
     * Validates body and its fields and returns errors for every field (key).
     * @returns {Record<string, null | Error | string>}
     */
    get errors(): Record<string, string | Error | null>;
    /**
     * Get message creation time
     * @returns {Date}
     */
    get time(): Date;
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
