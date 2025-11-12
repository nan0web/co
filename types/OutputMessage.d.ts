/**
 * @typedef {Object} OutputMessageInput
 * @property {string[]} [content=[]]
 * @property {string[] | any} [body=[]]
 * @property {Record<string, string>} [head={}]
 * @property {Error | null} [error=null]
 * @property {number} [priority=OutputMessage.PRIORITY.NORMAL]
 * @property {string} [type=this.type]
 * @property {string} [id=this.id]
 * @property {Date} [time=new Date()]
 */
/**
 * OutputMessage – message sent from the system to the UI.
 *
 * @class OutputMessage
 * @extends Message
 */
export default class OutputMessage extends Message {
    static PRIORITY: {
        LOW: number;
        NORMAL: number;
        HIGH: number;
        CRITICAL: number;
    };
    static TYPES: {
        TEXT: string;
        FORM: string;
        PROGRESS: string;
        ERROR: string;
        INFO: string;
        SUCCESS: string;
        WARNING: string;
        COMMAND: string;
        NAVIGATION: string;
    };
    /**
     * Creates an OutputMessage from plain input.
     *
     * @param {Object} input - Message data.
     * @returns {OutputMessage}
     */
    static from(input: any): OutputMessage;
    /**
     * Creates an OutputMessage.
     *
     * @param {OutputMessageInput | string | string[] | Error} [input={}] - Message properties.
     */
    constructor(input?: string | string[] | Error | OutputMessageInput | undefined);
    /** @type {string[]} */
    body: string[];
    /** @type {Object} */
    head: any;
    /** @type {Error|null} */
    error: Error | null;
    /** @type {number} */
    priority: number;
    /** @type {string} */
    type: string;
    /** @type {string} */
    id: string;
    /** @param {string[]|string} value */
    set content(arg: any);
    /** @returns {any} */
    get content(): any;
    /** @returns {number} */
    get size(): number;
    /** @returns {boolean} */
    get isError(): boolean;
    /** @returns {boolean} */
    get isInfo(): boolean;
    /**
     * Checks if the message type is valid.
     *
     * @returns {boolean}
     */
    isValidType(): boolean;
    /**
     * Checks whether the message contains any body content.
     *
     * @returns {boolean}
     */
    isEmpty(): boolean;
    /**
     * Combines multiple messages into a new one.
     *
     * @param {...OutputMessage} messages - Messages to combine.
     * @returns {OutputMessage}
     */
    combine(...messages: OutputMessage[]): OutputMessage;
    /**
     * Serialises the message to a plain JSON object.
     *
     * @returns {Object}
     */
    toJSON(): any;
}
export type OutputMessageInput = {
    content?: string[] | undefined;
    body?: string[] | any;
    head?: Record<string, string> | undefined;
    error?: Error | null | undefined;
    priority?: number | undefined;
    type?: string | undefined;
    id?: string | undefined;
    time?: Date | undefined;
};
import Message from "./Message.js";
