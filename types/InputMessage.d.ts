/** @typedef {Partial<Message> | null} InputMessageValue */
/**
 * Represents a message input with value, options, and metadata.
 */
export default class InputMessage {
    static ESCAPE: string;
    static Message: typeof Message;
    /**
     * Creates an InputMessage instance from the given value.
     * @param {InputMessage|object|string} value - The value to create from
     * @returns {InputMessage} An InputMessage instance
     */
    static from(value: InputMessage | object | string): InputMessage;
    /**
     * Creates a new InputMessage instance.
     * @param {object} props - Input message properties
     * @param {InputMessageValue} [props.value=null] - Input value
     * @param {string[]|string} [props.options=[]] - Available options
     * @param {boolean} [props.waiting=false] - Waiting state flag
     * @param {boolean} [props.escaped=false] - Sets value to escape when true
     */
    constructor(props?: {
        value?: InputMessageValue | undefined;
        options?: string | string[] | undefined;
        waiting?: boolean | undefined;
        escaped?: boolean | undefined;
    });
    /** @type {Message} Input value */
    value: Message;
    /** @type {string[]} Available options for this input */
    options: string[];
    /** @type {boolean} Whether this input is waiting for response */
    waiting: boolean;
    /**
     * Returns the escape value.
     * @returns {string}
     */
    get ESCAPE(): string;
    /** @returns {typeof Message} */
    get Message(): typeof Message;
    /**
     * Checks if the input value is empty.
     * @returns {boolean} True if value is empty or null, false otherwise
     */
    get empty(): boolean;
    /**
     * Gets the timestamp when input was created.
     * @returns {number} Creation timestamp
     */
    get time(): number;
    /**
     * Checks if the input is an escape sequence.
     * @returns {boolean} True if input value is escape sequence, false otherwise
     */
    get isEscaped(): boolean;
    /**
     * Validates if the input has a non-empty value.
     * @returns {boolean} True if input is valid, false otherwise
     */
    get isValid(): boolean;
    /**
     * Converts the input to a plain object representation.
     * @returns {object} Object with all properties including timestamp
     */
    toObject(): object;
    /**
     * Converts the input to a string representation including timestamp.
     * @returns {string} String representation with timestamp and value
     */
    toString(): string;
    #private;
}
export type InputMessageValue = Partial<Message> | null;
import Message from "./Message.js";
