# @nan0web/co

Communication starts here with a simple Message.

## Description

The `@nan0web/co` package provides a minimal yet powerful foundation for message-based communication systems.  
It includes core classes:

- `Message` — a base class for representing generic messages with timestamps.
- `CommandMessage` — an extension of `Message`, designed for handling command-line-style messages with arguments and options.
- `Command` — a class for defining CLI commands with options and arguments, similar to Python's click.
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
    verbose: [Boolean, false, 'Enable verbose output'],
    file: [String, 'input.txt', 'Input file path', { required: true }]
  },
  arguments: {
    name: [String, '', 'Name of the item to process'],
    '*': [String, 'Additional items']
  }
})

// Parse command line arguments
const parsed = cmd.parse(['example', '--verbose', '--file', 'config.json', 'item1', 'item2'])
console.log(parsed.opts.verbose) // true
console.log(parsed.opts.file)    // 'config.json'
console.log(parsed.args)         // ['item1', 'item2']

// Show help
console.log(cmd.generateHelp())
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

ISC — see [LICENSE](./LICENSE)
