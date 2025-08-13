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
     * @param {string[]} [input.args] - Command arguments
     * @param {object} [input.opts] - Command options
     * @param {object[]} [input.children] - Subcommands in their messages, usually it is only one or zero.
     */
    constructor(input?: {
        body?: any;
        args?: string[] | undefined;
        opts?: object;
        children?: any[] | undefined;
    });
    /** @type {string[]} */
    args: string[];
    /** @type {object} */
    opts: object;
    /** @type {CommandMessage[]} */
    children: CommandMessage[];
    add(msg: any): void;
}
import Message from "../Message.js";
