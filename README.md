# @nan0web/co

Communication starts here with a simple Message.

<!-- %PACKAGE_STATUS% -->

## Description

The `@nan0web/co` package provides a minimal yet powerful foundation for
message‑based communication systems and contact handling.

Core classes:

- `Message` — a base class for representing generic messages with timestamps.
- `Chat` — represents chat messages and chains.
- `Contact` — parses and represents contact information with specific URI schemes.
- `Language` — handles localisation data including name, icon, code and locale.
- `I18nMessage` — extends `Message` with translation support.
- `InputMessage` / `OutputMessage` — UI‑oriented message adapters.
- `App` — minimal event‑driven application core.

Use `@nan0web/ui-cli` for CLI‑specific commands (e.g. parsing `process.argv` to Messages).

These classes are perfect for building parsers,
communication protocols, message validation layers,
and contact or language data management.

## Installation

How to install with npm?
```bash
npm install @nan0web/co
```

How to install with pnpm?
```bash
pnpm add @nan0web/co
```

How to install with yarn?
```bash
yarn add @nan0web/co
```

## Usage

### Basic Message

Messages contain body and time when they were created.

How to create a Message instance from string?
```js
import { Message } from '@nan0web/co'
const msg = Message.from("Hello world")
console.info(String(msg)) // 2023-04-01T10:00:00 Hello world
```
Messages can be restored from old timestamp.

How to create a Message instance from object?
```js
import { Message } from '@nan0web/co'
const msg = Message.from({ body: "Hello 2000", time: new Date("2000-01-01") })
console.info(String(msg)) // 2000-01-01T00:00:00.000Z Hello 2000
```
### Chat Messages

Chat creates a message chain with authors.

How to create a message chain with authors in a chat?
```js
const alice = Contact.from("alice@example.com")
const bob = Contact.from("+1234567890")
const chat = new Chat({
	author: alice,
	body: "Hi Bob!",
	next: new Chat({
		author: bob,
		body: "Hello Alice!",
	}),
})
console.info(String(chat))
// 2025-11-12T11:02:37.033Z mailto:alice@example.com
// Hi Bob!
// ---
// 2025-11-12T11:02:37.033Z tel:+1234567890
// Hello Alice!
```
### Contact Handling

Contact handles different URIs and string inputs properly.

How to create contact with different URIs and string inputs properly?
```js
// Create direct instances
const email = new Contact({ type: Contact.EMAIL, value: "test@example.com" })
const phone = Contact.from("+123456") // Auto-detected as telephone
const address = Contact.parse("123 Main St")  // Auto-detected as address
// Parse types
console.info(email.toString()) // "mailto:test@example.com"
console.info(phone.toString()) // "tel:+123456"
console.info(address.toString()) // "address:123 Main St"
// Auto-detect from strings
const website = Contact.parse("https://example.com") // Auto-detected as URL
console.info(website) // "https://example.com"
```
### Language Handling

Language handles ISO codes and string conversion.

How to create a Language instance?
```js
const lang = new Language({
	name: "English",
	icon: "🇬🇧",
	code: "en",
	locale: "en-US",
})
console.info(String(lang)) // ← English 🇬🇧
```
### InputMessage & OutputMessage usage

How to use InputMessage and OutputMessage?
```js
import { InputMessage, OutputMessage } from "@nan0web/co"
const inMsg = new InputMessage({ value: "user input", options: ["yes", "no"] })
const outMsg = new OutputMessage({ content: ["Result:", "Success"], type: OutputMessage.TYPES.SUCCESS })
console.info(inMsg.toString()) // ← TIMESTAMP user input
console.info(outMsg.content) // ← ["Result:", "Success"]
```
### App core example

How to use the App core class?
```js
import { App } from "@nan0web/co"
const app = new App()
const im = new app.InputMessage({ value: "ping" })
const gen = app.run(im)
const { value, done } = await gen.next()
const { done: done2 } = await gen.next()
console.info(value) // ← OutputMessage { body: ["Run"], ... }
console.info(done) // ← false
console.info(done2) // ← true
```
### Message body parsing with static meta configuration

The `Message.parseBody` method can transform raw input objects into a
well‑defined body using a static schema.  Below is a concise example
that mirrors the test suite’s `ParseBody` definition.

The test ensures the parsing behaves exactly as described.

How to parse a message body using Message.parseBody()?
```js
import { Message } from "@nan0web/co"
const Body = {
	// Show help flag (alias: h)
	help: { alias: "h", defaultValue: false },
	// Output format (alias: fmt)
	format: { alias: "fmt", defaultValue: "txt", options: ["txt", "md", "html"] },
	// Verbose flag (no alias)
	verbose: { defaultValue: false }
}
const raw = { h: true, fmt: "md", verbose: 1 }
const parsed = Message.parseBody(raw, Body)
console.info(parsed)
// { help: true, format: "md", verbose: true }
```
You can use classes with static and typedef for better IDE autocomplete support

How to parse a message body using Message.parseBody()?
```js
import { Message } from "@nan0web/co"
class Body {
	// Show help flag
	static help = { alias: "h", defaultValue: false }
	/** @type {boolean} */
	help = false
	// Output format
	static format = { alias: "fmt", defaultValue: "txt", options: ["txt", "md", "html"] }
	/** @type {"txt" | "md" | "html"} */
	format = "md" // defaultValue has priority over property value
	// Verbose flag (to cast value type or defaultValue must be defined in the static meta)
	static verbose = { alias: "v", type: "boolean" }
	/** @type {boolean} */
	verbose = false
}
const raw = { h: true, fmt: "md", v: 1 }
const parsed = Message.parseBody(raw, Body)
console.info(parsed)
// { help: true, format: "md", verbose: true }
```
## API

### Message

* **Properties**
  * `body` – the actual content of the message.
  * `time` – timestamp of creation.

* **Methods**
  * `toObject()` – returns `{ body, time }`.
  * `toString()` – formats timestamp and body as a string.
  * `static from(input)` – instantiates from string or object.
  * `validate()` – checks body against schema (with `getErrors()`).

### Chat

Extends `Message`.

* **Properties**
  * `author` – the contact object representing the message sender.
  * `next` – the next chat message in the chain (nullable).

* **Methods**
  * `get size` – returns the chain length.
  * `get recent` – returns the last chat message in the chain.
  * `toString()` – formats the entire chat chain.
  * `static from(input)` – builds a chat chain from array‑like input.

### Contact

* **Static URI prefixes**
  * `Contact.ADDRESS` – `"address:"`
  * `Contact.EMAIL` – `"mailto:"`
  * `Contact.TELEPHONE` – `"tel:"`
  * `Contact.URL` – `"//"`
  * Social links: FACEBOOK, INSTAGRAM, LINKEDIN, SIGNAL, SKYPE, TELEGRAM, VIBER, WHATSAPP, X

* **Methods**
  * `toString()` – converts to a URI string.
  * `static parse(string)` – detects a URI scheme or uses heuristics to deduce the type.
  * `static from(input)` – returns a Contact instance if one already exists or creates a new one.

### Language

* **Properties**
  * `name` – language name in its native form.
  * `icon` – flag emoji.
  * `code` – ISO 639‑1 language code.
  * `locale` – specific locale identifier.

* **Methods**
  * `toString()` – combines `name` and `icon`.
  * `static from(input)` – creates or returns a Language instance.

All exported classes should pass basic test to ensure API examples work

## Playground

How to run playground script?
```bash
# Clone the repository and run the CLI playground
git clone https://github.com/nan0web/co.git
cd co
npm install
npm run play
```

## Contributing

How to contribute? - [check here]($pkgURL/blob/main/CONTRIBUTING.md)

## License

How to license? - [ISC LICENSE]($pkgURL/blob/main/LICENSE) file.
