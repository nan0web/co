# @nan0web/co

Communication starts here with a simple Message.

## Description

The `@nan0web/co` package provides a minimal yet powerful foundation for message-based communication systems.  
It includes core classes:

- `Message` — a base class for representing generic messages with timestamps.
- `CommandMessage` — an extension of `Message`, designed for handling command-line-style messages with arguments and options.
- `Command` — a class for defining CLI commands with options and arguments, similar to Python's `click`.
- `CommandOption` — represents individual options or arguments for a command.
- `CommandError` — custom error class for command-related errors.

These classes are perfect for building parsers, CLI tools, communication protocols, or message validation layers.

## Installation

```bash
npm install @nan0web/co
```

## Usage

### Basic Message

```js
import { Message } from '@nan0web/co'

const msg = new Message('Hello world')
console.log(msg.toString()) // 2023-04-01T10:00:00 Hello world
```

### Command Message

```js
import { CommandMessage } from '@nan0web/co'

const cmd = new CommandMessage('git commit -m "Initial commit" --verbose')
console.log(cmd.args) // ['git', 'commit', 'Initial commit']
console.log(cmd.opts) // { m: 'Initial commit', verbose: true }
```

### Command with Options and Arguments

```js
import { Command } from '@nan0web/co'

const cmd = new Command({
  name: 'example',
  help: 'An example command',
  options: {
    // Boolean option with default provided via meta object
    verbose: [Boolean, false, 'Enable verbose output', { default: false }],
    // String option with a default value and an alias defined in meta
    file: [String, 'input.txt', 'Input file path', { alias: 'f', default: 'input.txt' }]
  },
  arguments: {
    name: [String, '', 'Name of the item to process'],
    '*': [String, 'Additional items']
  }
})

// Parse command line arguments
const parsed = cmd.parse(['example', '--verbose', '--file', 'config.json', 'item1', 'item2'])
console.log(parsed.opts.verbose) // true (overrides default)
console.log(parsed.opts.file)    // 'config.json'
console.log(parsed.args)         // ['item1', 'item2']

// Show help (string)
console.log(cmd.generateHelp())
```

### Advanced Option Definition

`CommandOption` can be created from:

* **Array syntax** – `[name, defaultValue, help, meta?]`  
  *`meta`* can contain `default`, `alias`, `required`, etc.
* **Object syntax** – `{ name, type, defaultValue, help, meta }`

Both syntaxes are automatically transformed into a `CommandOption` instance.

### Complex Types

Commands support complex types that can be parsed from string representations:

```js
class Complex {
  value
  count
  constructor(input = {}) {
    const { value = '', count = 0 } = input
    this.value = String(value)
    this.count = Number(count)
  }
  toString() {
    return [this.count, this.value].join('\n')
  }
  static fromString(str) {
    const [count, ...value] = String(str).split('\n')
    return new Complex({ count, value: value.join('\n') })
  }
}

const cmd = new Command({
  name: 'test',
  arguments: {
    config: [Complex, 'Complex configuration']
  }
})

const parsed = cmd.parse(['test', '5\nmy value'])
console.log(parsed.args[0] instanceof Complex) // true
console.log(parsed.args[0].count) // 5
console.log(parsed.args[0].value) // 'my value'
```

### Subcommands

Commands can have subcommands for building hierarchical CLI tools:

```js
import { Command } from '@nan0web/co'

const subcmd = new Command({
  name: 'init',
  help: 'Initialize a new project'
})

const mainCmd = new Command({
  name: 'mycli',
  help: 'My CLI tool',
  subcommands: [subcmd]
})

// Parse with subcommand
const parsed = mainCmd.parse(['mycli', 'init'])
```

### Errors

All parsing and conversion errors are thrown as `CommandError`. The error contains a `data` field with additional context, e.g.:

```js
try {
  cmd.parse(['example', '--count', '-1'])
} catch (err) {
  if (err instanceof CommandError) {
    console.error(err.message)   // "Invalid value for count: -1"
    console.error(err.data)      // { validValues: [...], providedValue: '-1' }
  }
}
```

## Built-in Features

Every `Command` instance automatically includes:
- `--help` / `-h` flag to display help information
- `--version` / `-V` flag to display version information

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

ISC — see [LICENSE](./LICENSE)
