/**
 * Base Message class
 */
export default class Message {
	/** @type {Record<string, any>} */
	head = {}
	/** @type {any} */
	body

	/** @type {Date} */
	#time

	/**
	 * Create a new Message instance
	 * @param {object} input
	 * @param {Record<string, any>} [input.head] - Message head.
	 * @param {any} [input.body] - Message body.
	 * @param {Date} [input.time] - Created at time.
	 */
	constructor(input = {}) {
		const {
			head = this.head,
			body,
			time = Date.now(),
		} = input
		this.#time = new Date(time)
		this.head = head
		this.body = body
	}

	/**
	 * Returns true if message is valid.
	 * @returns {boolean}
	 */
	get isValid() {
		return Object.values(this.errors).every(e => null === e)
	}

	/**
	 * Validates body and its fields and returns errors for every field (key).
	 * @returns {Record<string, null | Error | string>}
	 */
	get errors() {
		return {}
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
		return `${this.time.toISOString()} ${this.body}`
	}

	/**
	 * Create Message instance from body
	 * @param {any} input - body to create message from
	 * @returns {Message} - Message instance
	 */
	static from(input) {
		if (input instanceof Message) return input
		if ("string" === typeof input) return new Message({ body: input })
		return new Message(input)
	}
}
