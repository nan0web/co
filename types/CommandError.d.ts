export default CommandError;
/**
 * Command error class
 */
declare class CommandError extends Error {
    /**
     * Create a new CommandError instance
     * @param {string} message - Error message
     * @param {any} data - Associated data
     */
    constructor(message?: string, data?: any);
    /** @type {any} */
    data: any;
}
