export default CommandMessage;
/**
 * Command message class
 * Enhanced to handle equals syntax and validate inputs
 */
declare class CommandMessage extends Message {
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
     * @param {string[]} [input.args] - Command arguments
     * @param {object} [input.opts] - Command options
     * @param {object[]} [input.children] - Subcommands in their messages, usually it is only one or zero.
     */
    constructor(input?: {
        body?: any;
        name?: string | undefined;
        args?: string[] | undefined;
        opts?: object;
        children?: any[] | undefined;
    });
    /** @type {string} */
    name: string;
    /** @type {string[]} */
    args: string[];
    /** @type {object} */
    opts: object;
    /** @type {CommandMessage[]} */
    children: CommandMessage[];
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
}
import Message from "../Message.js";
