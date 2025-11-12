import { empty, Enum, isConstructible, to as castTo } from "@nan0web/types"

/**
 * @typedef {object} MessageInput
 * @property {Record<string, any>} [input.head] - Message head.
 * @property {any} [input.body] - Message body.
 * @property {Date|number} [input.time] - Creation timestamp.
 */

/**
 * Base Message class.
 *
 * Provides a timestamped container for arbitrary payload data,
 * validation utilities via a static Body schema and
 * a generic {@link parseBody} helper.
 *
 * @class Message
 */
export default class Message {
	/**
	 * Body class defines the meta data for the body object.
	 *
	 * Sub‑classes can extend this class to declare fields,
	 * default values, validation functions and attribute metadata.
	 */
	static Body = class {}

	/** @type {Record<string, any>} */
	head = {}
	/** @type {any} */
	body

	/** @type {Date} */
	#time

	/**
	 * Create a new Message instance.
	 *
	 * @param {MessageInput} [input={}]
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
	 * Check whether the message has no body and no head.
	 *
	 * @returns {boolean}
	 */
	get empty() {
		return empty(this.body) && empty(this.head)
	}

	/**
	 * Returns true if the message passes validation.
	 *
	 * @returns {boolean}
	 */
	get isValid() {
		const errors = this.getErrors()
		return Object.keys(errors).length === 0
	}

	/**
	 * Get message creation time.
	 *
	 * @returns {Date}
	 */
	get time() {
		return this.#time
	}

	/**
	 * Validate body fields according to the static {@link Body} schema.
	 *
	 * @returns {Record<string, string[]>} Mapping of field names to error messages.
	 */
	getErrors() {
		const self = /** @type {typeof Message} */ (this.constructor)
		const schema = new self.Body()
		/** @type {Record<string, string[]>} */
		const errors = {}
		for (const [key] of Object.entries(schema)) {
			const value = this.body?.[key]
			const fn = self.Body[`${key}Validation`] ?? self.Body[key]?.validation ?? (() => true)
			if (typeof fn === "function") {
				const err = fn(value)
				if (err === true) continue
				if (!errors[key]) errors[key] = []
				if (Array.isArray(err)) {
					err.forEach(e => errors[key].push(e))
				} else {
					errors[key].push(err)
				}
			}
		}
		return errors
	}

	/**
	 * Convert message to plain object form.
	 *
	 * @returns {{body:any, time:number}} Object with body and timestamp.
	 */
	toObject() {
		return { body: this.body, time: this.time.getTime() }
	}

	/**
	 * Convert message to a string with ISO timestamp.
	 *
	 * @returns {string}
	 */
	toString() {
		return `${this.time.toISOString()} ${this.body}`
	}

	/**
	 * Create a Message instance from a simple value.
	 *
	 * @param {any} input - Body string, object or existing Message.
	 * @returns {Message}
	 */
	static from(input) {
		if (input instanceof Message) return input
		if (typeof input === "string") return new Message({ body: input })
		return new Message(input)
	}

	/**
	 * Parse raw input according to a schema.
	 *
	 * Handles alias mapping, default values and enum validation.
	 *
	 * @param {Record<string, any>} input - Raw input object.
	 * @param {Record<string, any> | Function} Body - Schema definition.
	 * @returns {Record<string, any>} Parsed and validated result.
	 * @throws {Error} When a value fails enum validation.
	 */
	static parseBody(input, Body) {
		const result = {}
		let template = { ...input }
		if (typeof Body === "function" && isConstructible(Body)) {
			template = Object.create(Body.prototype)
		}
		for (const [to, config] of Object.entries(Body)) {
			// Resolve source key (alias if provided)
			let srcKey = to
			if (config.alias && input[config.alias] !== undefined) {
				srcKey = config.alias
			}
			let value = input[srcKey]

			// Apply default when missing
			if (value === undefined) {
				if ("defaultValue" in config) {
					value = config.defaultValue
				} else if (to in template) {
					value = template[to]
				}
			}

			// Cast to proper type if needed
			let type
			if ("type" in config) {
				type = config.type
			} else if ("defaultValue" in config) {
				type = typeof config.defaultValue
			} else if (to in template) {
				type = typeof template[to]
			}
			if (type) {
				value = castTo(type)(value)
			}

			// Enum validation if options provided
			if (Array.isArray(config.options)) {
				value = Enum(...config.options)(value)
			}

			result[to] = value
		}
		return result
	}
}
