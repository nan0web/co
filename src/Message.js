/**
 * Base Message class
 */
class Message {
	/** @type {any} */
	body

	/** @type {Date} */
	#time

	/**
	 * Create a new Message instance
	 * @param {object} input
	 * @param {any} [input.body] - Message body.
	 * @param {Date} [input.time] - Created at time.
	 */
	constructor(input = {}) {
		if ("string" === typeof input) {
			input = { body: input }
		}
		const {
			body = "",
			time = Date.now(),
		} = input
		this.#time = new Date(time)
		this.body = body
	}

	/**
	 * Get message creation time
	 * @returns {Date}
	 */
	get time() {
		return this.#time
	}

	/**
	 * Convert message to object representation
	 * @returns {object} - Object with body and time properties
	 */
	toObject() {
		return { body: this.body, time: this.time.getTime() }
	}

	/**
	 * Convert message to string representation
	 * @returns {string} - String with timestamp and body
	 */
	toString() {
		return `${this.time.toISOString().split(".")[0]} ${this.body}`
	}

	/**
	 * Create Message instance from body
	 * @param {any} input - body to create message from
	 * @returns {Message} - Message instance
	 */
	static from(input) {
		if (input instanceof Message) return input
		return new Message(input)
	}
}

export default Message
