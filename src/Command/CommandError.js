/**
 * Command error class
 */
class CommandError extends Error {
	/** @type {any} */
	data

	/**
	 * Create a new CommandError instance
	 * @param {string} message - Error message
	 * @param {any} data - Associated data
	 */
	constructor(message = "", data = null) {
		super(message)
		this.data = data
	}

	/**
	 * Convert error to string representation
	 * @returns {string} - String with error message and data
	 */
	toString() {
		return `${this.message}\n${JSON.stringify(this.data, null, 2)}`
	}
}

export default CommandError
