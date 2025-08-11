export default CommandMessage;
/**
 * Command message class
 * Enhanced to handle equals syntax and validate inputs
 */
declare class CommandMessage extends Message {
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
     */
    constructor(input?: {
        body?: any;
        args?: string[] | undefined;
        opts?: object;
    });
    /** @type {string[]} */
    args: string[];
    /** @type {object} */
    opts: object;
}
import Message from "./Message.js";
