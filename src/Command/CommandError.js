/**
 * Command error class
 * @extends Error
 */
class CommandError extends Error {
	/** @type {any} */
	data

	/**
	 * Create a new CommandError instance
	 * @param {string} message - Error message
	 * @param {any} [data=null] - Associated data providing context for the error
	 */
	constructor(message, data = null) {
		super(message)
		this.data = data
	}

	/**
	 * Convert error to string representation
	 * @returns {string} - Formatted string containing the message and pretty‑printed JSON data
	 */
	toString() {
		return `${this.message}\n${JSON.stringify(this.data, null, 2)}`
	}
}

export default CommandError
