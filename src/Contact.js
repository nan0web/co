import { typeOf } from "@nan0web/types"

class Contact {
	static ADDRESS = "address:"
	static EMAIL = "mailto:"

	static FACEBOOK = "https://www.facebook.com/"
	static INSTAGRAM = "https://www.instagram.com/"
	static LINKEDIN = "https://www.linkedin.com/in/"
	static SIGNAL = "https://signal.me/#p/"
	static SKYPE = "skype:"
	static TELEGRAM = "https://t.me/"
	static VIBER = "viber://chat?number="
	static WHATSAPP = "https://wa.me/"
	static X = "https://x.com/"

	static TELEPHONE = "tel:"
	static URL = "//"

	/** @type {string} */
	type
	/** @type {string} */
	value

	/**
	 * @param {object} input
	 * @param {string} [input.type=Contact.ADDRESS]
	 * @param {string} [input.value=""]
	 */
	constructor(input = {}) {
		if ("string" === typeof input) {
			input = Contact.parse(input)
		}
		const {
			type = Contact.ADDRESS,
			value = "",
		} = input
		this.type = String(type)
		this.value = String(value)
	}
	toString() {
		if ([Contact.URL].includes(this.type)) {
			return this.value
		}
		return this.type + this.value
	}
	/**
	 * @param {string} input
	 * @returns {Contact}
	 */
	static parse(input) {
		input = String(input)
		let value = input
		let type
		if (typeOf(Number)(input)) {
			type = String(type)
		}
		type = Object.values(Contact).find(str => input.startsWith(str)) ?? ""
		if (type) {
			value = input.slice((type ?? "").length)
		} else {
			if (/^[a-z0-9\._\-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(input)) {
				type = Contact.EMAIL
			}
			else if (/^[\+\-\(\)\s\d]{6,}$/.test(input)) {
				type = Contact.TELEPHONE
			}
			else if (/^(http|https|ftp)?:\/\//.test(input)) {
				type = Contact.URL
			}
			else {
				type = Contact.ADDRESS
			}
		}
		return new Contact({ type, value })
	}
	/**
	 * @param {object} input
	 * @returns {Contact}
	 */
	static from(input) {
		if (input instanceof Contact) return input
		return new this(input)
	}
}

export default Contact
