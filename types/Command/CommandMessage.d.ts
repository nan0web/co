/**
 * Command message class
 * Enhanced to handle equals syntax and validate inputs
 */
export default class CommandMessage extends Message {
    /**
     * Create CommandMessage instance from body
     * @param {any} input - body to create message from
     * @returns {CommandMessage} - Message instance
     */
    static from(input: any): CommandMessage;
    /**
     * Parse command line arguments into CommandMessage
     * @param {string[] | string} argv - Command line arguments or a command string
     * @returns {CommandMessage} - Parsed command message
     */
    static parse(argv?: string[] | string): CommandMessage;
    /**
     * Create a new CommandMessage instance
     * @param {object} input - Command message properties
     * @param {*} [input.body] - Message body, used only to store original input if it is string
     * @param {string} [input.name] - Command name
     * @param {string[]} [input.argv] - Command arguments
     * @param {object} [input.opts] - Command options
     * @param {object[]} [input.children] - Subcommands in their messages, usually it is only one or zero.
     */
    constructor(input?: {
        body?: any;
        name?: string | undefined;
        argv?: string[] | undefined;
        opts?: object;
        children?: any[] | undefined;
    });
    /**
     * @param {string} value - Command name
     */
    set name(value: string);
    /**
     * @returns {string} Command name
     */
    get name(): string;
    /**
     * @param {string[]} value - Command arguments
     */
    set argv(value: string[]);
    /**
     * @returns {string[]} Command arguments without name (first argument)
     */
    get argv(): string[];
    /**
     * @param {object} value - Command options
     */
    set opts(value: object);
    /**
     * @returns {object} Command options
     */
    get opts(): object;
    /**
     * @param {CommandMessage[]} value - Subcommands
     */
    set children(value: CommandMessage[]);
    /**
     * @returns {CommandMessage[]} Subcommands
     */
    get children(): CommandMessage[];
    /**
     * @returns {string[]} Command arguments incuding name
     */
    get args(): string[];
    /**
     * @returns {string} Sub command name if exists otherwise empty string.
     */
    get subCommand(): string;
    /**
     * @returns {CommandMessage} Sub command message.
     */
    get subCommandMessage(): CommandMessage;
    /**
     * @param {any} msg
     */
    add(msg: any): void;
    /**
     * Update message body based on current name, args and opts
     * @returns {void}
     */
    updateBody(): void;
    #private;
}
import Message from "../Message.js";
