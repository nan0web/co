export default Command;
export type CommandConfig = {
    /**
     * - Command name
     */
    name?: string | undefined;
    /**
     * - Command help
     */
    help?: string | undefined;
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
 * @property {string} [help] - Command help
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
    /**
     * Create a new Command instance
     * @param {CommandConfig} config - Command configuration
     */
    constructor(config?: CommandConfig, ...args: any[]);
    /** @type {string} */
    name: string;
    /** @type {string} */
    help: string;
    /** @type {string} */
    usage: string;
    /** @type {Map<string, CommandOption>} */
    options: Map<string, CommandOption>;
    /** @type {Map<string, CommandOption>} */
    arguments: Map<string, CommandOption>;
    /** @type {Map<string, Command>} */
    subcommands: Map<string, Command>;
    /** @type {Map<string, string>} */
    aliases: Map<string, string>;
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
    addOption(name: string, type: Function, def?: any, help?: string, alias?: string | undefined): Command;
    /**
     * Returns the option by its name.
     * @param {string} name
     * @returns {CommandOption | undefined}
     */
    getOption(name: string): CommandOption | undefined;
    /**
     * Add an argument to the command
     * @param {string} name - Argument name
     * @param {Function} type - Argument type
     * @param {any} def - Default value for the argument
     * @param {string} help - Argument help
     * @returns {Command} - This command instance
     */
    addArgument(name: string, type: Function, def?: any, help?: string): Command;
    /**
     * Add a subcommand to the command
     * @param {Command} subcommand - Subcommand instance
     * @returns {Command} - This command instance
     */
    addSubcommand(subcommand: Command): Command;
    /**
     * Parse arguments and populate options
     * @param {string[] | string} argv - Command line arguments
     * @returns {CommandMessage} - Parsed command message
     */
    parse(argv: string[] | string): CommandMessage;
    /**
     * Run the built-in help logic.
     * Returns the help string; callers may print it or otherwise use it.
     * @returns {string}
     */
    runHelp(): string;
    /**
     * Determine whether a function can be used as a constructor.
     * @param {Function} fn - Function to test.
     * @returns {boolean} True if callable with `new`, false otherwise.
     */
    isConstructible(fn: Function): boolean;
    /**
     * Convert a value to the specified type
     * @param {any} value - Value to convert
     * @param {Function|Array} type - Target type (Function constructor, Array for enum)
     * @param {string} name - Name for error reporting
     * @returns {any} - Converted value
     */
    convertValue(value: any, type: Function | any[], name: string): any;
    /**
     * Show help information
     * @returns {string}
     */
    generateHelp(): string;
    toString(): string;
}
import CommandOption from "./CommandOption.js";
import CommandMessage from "./CommandMessage.js";
