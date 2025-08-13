export default CommandError;
/**
 * Command error class
 * @extends Error
 */
declare class CommandError extends Error {
    /**
     * Create a new CommandError instance
     * @param {string} message - Error message
     * @param {any} [data=null] - Associated data providing context for the error
     */
    constructor(message: string, data?: any);
    /** @type {any} */
    data: any;
}
