export default Message;
/**
 * Base Message class
 */
declare class Message {
    /**
     * Create Message instance from body
     * @param {any} input - body to create message from
     * @returns {Message} - Message instance
     */
    static from(input: any): Message;
    /**
     * Create a new Message instance
     * @param {object} input
     * @param {any} [input.body] - Message body.
     * @param {Date} [input.time] - Created at time.
     */
    constructor(input?: {
        body?: any;
        time?: Date | undefined;
    });
    /** @type {any} */
    body: any;
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
