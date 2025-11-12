/**
 * @typedef {object} MessageInput
 * @property {Record<string, any>} [input.head] - Message head.
 * @property {any} [input.body] - Message body.
 * @property {Date|number} [input.time] - Creation timestamp.
 */
/**
 * Base Message class.
 *
 * Provides a timestamped container for arbitrary payload data,
 * validation utilities via a static Body schema and
 * a generic {@link parseBody} helper.
 *
 * @class Message
 */
export default class Message {
    /**
     * Body class defines the meta data for the body object.
     *
     * Sub‑classes can extend this class to declare fields,
     * default values, validation functions and attribute metadata.
     */
    static Body: {
        new (): {};
    };
    /**
     * Create a Message instance from a simple value.
     *
     * @param {any} input - Body string, object or existing Message.
     * @returns {Message}
     */
    static from(input: any): Message;
    /**
     * Parse raw input according to a schema.
     *
     * Handles alias mapping, default values and enum validation.
     *
     * @param {Record<string, any>} input - Raw input object.
     * @param {Record<string, any> | Function} Body - Schema definition.
     * @returns {Record<string, any>} Parsed and validated result.
     * @throws {Error} When a value fails enum validation.
     */
    static parseBody(input: Record<string, any>, Body: Record<string, any> | Function): Record<string, any>;
    /**
     * Create a new Message instance.
     *
     * @param {MessageInput} [input={}]
     */
    constructor(input?: MessageInput | undefined);
    /** @type {Record<string, any>} */
    head: Record<string, any>;
    /** @type {any} */
    body: any;
    /**
     * Check whether the message has no body and no head.
     *
     * @returns {boolean}
     */
    get empty(): boolean;
    /**
     * Returns true if the message passes validation.
     *
     * @returns {boolean}
     */
    get isValid(): boolean;
    /**
     * Get message creation time.
     *
     * @returns {Date}
     */
    get time(): Date;
    /**
     * Validate body fields according to the static {@link Body} schema.
     *
     * @returns {Record<string, string[]>} Mapping of field names to error messages.
     */
    getErrors(): Record<string, string[]>;
    /**
     * Convert message to plain object form.
     *
     * @returns {{body:any, time:number}} Object with body and timestamp.
     */
    toObject(): {
        body: any;
        time: number;
    };
    /**
     * Convert message to a string with ISO timestamp.
     *
     * @returns {string}
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
     * - Creation timestamp.
     */
    time?: number | Date | undefined;
};
