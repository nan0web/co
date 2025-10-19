/**
 * Chat message class
 * Represents a message in a chat with an author and optional next message
 */
export default class Chat extends Message {
    /**
     * Create Chat instance from input
     * @param {any} input - Input to create chat from
     * @returns {Chat} - Chat instance
     */
    static from(input: any): Chat;
    /**
     * Escape chat body to prevent injection
     * @param {any} body - Body to escape
     * @returns {string} - Escaped body
     */
    static escape(body: any): string;
    /**
     * Parse string chat into array of messages
     * @param {string} chat - String chat to parse
     * @returns {Array} - Array of parsed message objects
     */
    static parse(chat: string): any[];
    /**
     * Create a new Chat instance
     * @param {object} [input={}] - Chat properties or body string
     * @param {Contact} [input.author] - Message author
     * @param {Chat} [input.next] - Next message in chat
     * @param {any} [input.body] - Message body
     * @param {Date} [input.time] - Message timestamp
     */
    constructor(input?: {
        author?: Contact | undefined;
        next?: Chat | undefined;
        body?: any;
        time?: Date | undefined;
    });
    /** @type {Contact} */
    author: Contact;
    /** @type {Chat?} */
    next: Chat | null;
    /**
     * Get the size of the chat chain
     * @returns {number} - Number of messages in the chain
     */
    get size(): number;
    /**
     * Get the most recent message in the chat chain
     * @returns {Chat} - Most recent chat message
     */
    get recent(): Chat;
}
import Message from "./Message.js";
import Contact from "./Contact.js";
