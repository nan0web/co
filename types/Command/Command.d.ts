export default Command;
export type CommandConfig = {
    /**
     * - Command name
     */
    name?: string | undefined;
    /**
     * - Parent command
     */
    parent?: Command | null | undefined;
    /**
     * - Command help
     */
    help?: string | undefined;
    /**
     * - Logger instance
     */
    logger?: Logger | undefined;
    /**
     * - Command options
     */
    options?: object;
    /**
     * - Command arguments
     */
    arguments?: object;
    /**
     * - Subcommands
     */
    subcommands?: Command[] | undefined;
    /**
     * - Custom usage string
     */
    usage?: string | undefined;
};
/**
 * @typedef {Object} CommandConfig
 * @property {string} [name] - Command name
 * @property {Command | null} [parent] - Parent command
 * @property {string} [help] - Command help
 * @property {Logger} [logger] - Logger instance
 * @property {object} [options] - Command options
 * @property {object} [arguments] - Command arguments
 * @property {Array<Command>} [subcommands] - Subcommands
 * @property {string} [usage] - Custom usage string
 */
/**
 * Base Command class
 * Provides a robust CLI command interface following best practices
 */
declare class Command {
    static Message: typeof CommandMessage;
    static Error: typeof CommandError;
    static Option: typeof CommandOption;
    /**
     * Create a new Command instance
     * @param {CommandConfig} config - Command configuration
     */
    constructor(config?: CommandConfig, ...args: any[]);
    /** @type {string} */
    name: string;
    /** @type {Command | null} */
    parent: Command | null;
    /** @type {string} */
    help: string;
    /** @type {Logger} */
    logger: Logger;
    /** @type {string} */
    usage: string;
    /** @type {Map<string, CommandOption>} */
    options: Map<string, CommandOption>;
    /**
     * @deprecated Must be moved to options.
     * @type {Map<string, CommandOption>}
     */
    arguments: Map<string, CommandOption>;
    /** @type {Map<string, Command>} */
    subcommands: Map<string, Command>;
    /** @type {Map<string, string>} */
    aliases: Map<string, string>;
    /** @returns {typeof CommandMessage} */
    get Message(): typeof CommandMessage;
    /** @returns {typeof CommandOption} */
    get Option(): typeof CommandOption;
    /** @returns {string} */
    get path(): string;
    /**
     * Initialize default options and arguments
     * @returns {void}
     */
    init(): void;
    /**
     * Add an option to the command
     * @param {string} name - Option name
     * @param {Function} type - Option type
     * @param {any} def - Default value for the option
     * @param {string} help - Option help
     * @param {string} [alias] - Short alias for the option
     * @returns {Command} - This command instance
     */
    addOption(name: string, type: Function, def?: any, help?: string, alias?: string): Command;
    /**
     * Returns the option by its name.
     * @param {string} name - Option name
     * @returns {CommandOption | undefined} - Command option or undefined if not found
     */
    getOption(name: string): CommandOption | undefined;
    /**
     * Add an argument to the command
     * @param {string} name - Argument name
     * @param {Function} type - Argument type
     * @param {any} def - Default value for the argument
     * @param {string} help - Argument help
     * @param {boolean} required - Is argument required
     * @returns {Command} - This command instance
     */
    addArgument(name: string, type: Function, def?: any, help?: string, required?: boolean): Command;
    /**
     * Add a subcommand to the command
     * @param {Command} subcommand - Subcommand instance
     * @returns {Command} - This command instance
     */
    addSubcommand(subcommand: Command): Command;
    /**
     * Returns sub command by its name.
     * @param {string} name
     * @returns {Command | undefined}
     */
    getCommand(name: string): Command | undefined;
    /**
     * Parse arguments and populate options
     * @param {string[] | string} argv - Command line arguments
     * @returns {CommandMessage} - Parsed command message
     * @throws {CommandError} - If parsing fails
     */
    parse(argv: string[] | string): CommandMessage;
    /**
     * Run the built-in help logic.
     * Returns the help string; callers may print it or otherwise use it.
     * @returns {string} - Help information
     */
    runHelp(): string;
    /**
     * Convert a value to the specified type
     * @param {any} value - Value to convert
     * @param {Function|Array} type - Target type (Function constructor, Array for enum)
     * @param {string} name - Name for error reporting
     * @returns {any} - Converted value
     * @throws {CommandError} - If conversion fails
     */
    convertValue(value: any, type: Function | any[], name: string): any;
    /**
     * Show help information
     * @returns {string} - Help text
     */
    generateHelp(): string;
    /**
     * Convert command to string representation
     * @returns {string} - String representation of command
     */
    toString(): string;
}
import Logger from "@nan0web/log";
import CommandOption from "./CommandOption.js";
import CommandMessage from "./CommandMessage.js";
import CommandError from "./CommandError.js";
