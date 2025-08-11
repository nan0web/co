export default CommandOption;
/**
 * Command option class
 * Represents a single command option (flag, option, or argument)
 */
declare class CommandOption {
    /**
     * Create CommandOption from various input formats
     * @param {string|Array|object} input - Input to create option from
     * @returns {CommandOption} - CommandOption instance
     */
    static from(input: string | any[] | object): CommandOption;
    /**
     * Create a new CommandOption instance
     * @param {object} config - Option configuration
     * @param {string} [config.name] - Option name
     * @param {Function|Array} [config.type] - Option type
     * @param {any} [config.def] - Default value
     * @param {string} [config.help] - Help text
     * @param {string} [config.alias] - Short alias
     * @param {boolean} [config.required] - Is argument required
     */
    constructor(config?: {
        name?: string | undefined;
        type?: Function | any[] | undefined;
        def?: any;
        help?: string | undefined;
        alias?: string | undefined;
        required?: boolean | undefined;
    });
    /** @type {string} */
    name: string;
    /** @type {Function|Array} */
    type: Function | any[];
    /** @type {any} */
    def: any;
    /** @type {string} */
    help: string;
    /** @type {string} */
    alias: string;
    /** @type {boolean} */
    required: boolean;
    /**
     * Get default value for the option
     * @returns {any} - Default value
     */
    getDefault(): any;
    /**
     * Check if argument is optional
     * @returns {boolean}
     */
    isOptional(): boolean;
    /**
     * Convert option to object representation
     * @returns {object} - Object with option properties
     */
    toObject(): object;
    #private;
}
