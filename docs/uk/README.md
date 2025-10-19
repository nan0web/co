# @nan0web/co

Комунікація починається з простого повідомлення.

| [Статус](https://github.com/nan0web/monorepo/blob/main/system.md#написання-сценаріїв) | Документація | Покриття тестами | Функції | Версія Npm |
| --- | --- | --- | --- | --- |
| 🟢 `98.3%` | 🧪 [Англійською 🏴󠁧󠁢󠁥󠁮󠁧󠁿](https://github.com/nan0web/co/blob/main/README.md)<br />[Українською 🇺🇦](https://github.com/nan0web/co/blob/main/docs/uk/README.md) | 🟢 `91.5%` | ✅ d.ts 📜 system.md 🕹️ playground | — |

## Опис

Пакет `@nan0web/co` надає мінімальний, але потужний фундамент для систем комунікації на основі повідомлень і роботи з контактами.  
Основні класи:

- `Message` — базовий клас для представлення загальних повідомлень з часовими мітками.
- `Chat` — представляє чат-повідомлення та ланцюжки повідомлень.
- `Contact` — аналізує та представляє контактну інформацію з певними URI-схемами.
- `Language` — обробляє локалізаційні дані: назву, іконку, код та локаль.
- `Command` — клас для визначення CLI-команд з параметрами та аргументами.
- `CommandMessage` — розширення `Message`, призначене для роботи з повідомленнями у стилі командного рядка.
- `CommandOption` — представляє окремі параметри або аргументи команди.
- `CommandError` — спеціальний клас помилок для команд.

Ці класи чудово підходять для побудови парсерів,
CLI-інструментів, комунікаційних протоколів, шарів валідації повідомлень,
та управління контактною та мовною інформацією.

## Встановлення

Як встановити через npm?
```bash
npm install @nan0web/co
```

Як встановити через pnpm?
```bash
pnpm add @nan0web/co
```

Як встановити через yarn?
```bash
yarn add @nan0web/co
```

## Використання

### Базове повідомлення

Повідомлення містять тіло повідомлення (`body`) і час створення (`time`).

Як створити екземпляр `Message` з рядка?
```js
import { Message } from '@nan0web/co'
const msg = Message.from("Привіт світ")
console.info(String(msg)) // 2023-04-01T10:00:00 Привіт світ
```

Як створити екземпляр `Message` з об’єкта?
```js
import { Message } from '@nan0web/co'
const msg = Message.from({ body: "Привіт 2000", time: new Date("2000-01-01") })
console.info(String(msg)) // 2000-01-01T00:00:00.000Z Привіт 2000
```
### Чат-повідомлення

Чат створює ланцюжок повідомлень з авторами.

Як створити ланцюжок повідомлень з авторами в чаті?
```js
const alice = Contact.from("alice@example.com")
const bob = Contact.from("bob@example.com")

const chat = new Chat({
  author: alice,
  body: "Привіт, Боб!",
  next: new Chat({
    author: bob,
    body: "Привіт, Еліс!"
  })
})

const str = String(chat)
console.info(str)
```
### Обробка контактів

Клас `Contact` коректно обробляє різні URI та вхідні рядки.

Як правильно створювати контакти з різними URI та рядками?
```js
// Створення прямих екземплярів
const email = new Contact({ type: Contact.EMAIL, value: "test@example.com" })
const phone = Contact.from("+123456") // Автоматично визначається як телефон
const address = Contact.parse("вул. Головна, 123")  // Автоматично визначається як адреса

// Виведення URI
console.info(email.toString()) // "mailto:test@example.com"
console.info(phone.toString()) // "tel:+123456"
console.info(address.toString()) // "address:вул. Головна, 123"

// Автоматичне визначення з рядка
const website = Contact.parse("https://example.com") // Автоматично визначається як URL
console.info(website) // "https://example.com"
```
### Обробка мов

Клас `Language` обробляє ISO-коди та перетворює рядки.

Як створити екземпляр `Language`?
```js
const lang = new Language({
  name: "Українська",
  icon: "🇺🇦",
  code: "uk",
  locale: "uk-UA"
})

console.info(String(lang))
```
### Команда з параметрами та аргументами

Клас `Command` може бути налаштований з параметрами та аргументами.

Як створити команду з параметрами та аргументами?
```js
const cmd = new Command({
  name: "приклад",
  help: "Приклад команди",
  options: {
    verbose: [Boolean, false, "Увімкнути докладний вивід", "v"],
    file: [String, "input.txt", "Шлях до вхідного файлу", "f"]
  },
  arguments: {
    name: [String, "", "Назва елемента для обробки"],
    "*": [String, "Додаткові елементи"]
  }
})

const parsed = cmd.parse(["--verbose", "--file", "config.json", "елемент1", "елемент2"])
console.info(parsed.opts.verbose)
console.info(parsed.opts.file)
console.info(parsed.args)

```
### Підкоманди

`Command` підтримує вкладені команди — підкоманди.

Як додати підкоманди до головної команди?
```js
const initCmd = new Command({
  name: "init",
  help: "Ініціалізувати новий проект"
})
initCmd.addOption("version", Boolean, false, "Показати версію", "V")

const mainCmd = new Command({
  name: "mycli",
  help: "Мій CLI-інструмент",
  subcommands: [initCmd]
})

const msg = mainCmd.parse(["init", "-V"])
console.info(msg.subCommandMessage.opts.version) // true
console.info(msg.subCommandMessage.args) // ["init"]
console.info(msg.subCommandMessage.argv) // []
```
### Обробка помилок

Клас `CommandError` надає докладні повідомлення про помилки під час валідації команд.

Як обробляти помилки у команді?
```js
try {
  const cmd = new Command({
    name: "приклад",
    options: {
      count: [Number, 0, "Кількість"]
    }
  })
  const msg = cmd.parse(["приклад", "--count", "помилка"])
  console.info(String(msg)) // ← не відбувається вивід через викинуту помилку
} catch (err) {
  if (err instanceof CommandError) {
    console.error(err.message) // ← "Invalid number for count: помилка"
    console.error(JSON.stringify(err.data)) // ← {"providedValue":"помилка"}
  }
}
```
## API

### Message

* **Властивості**
  * `body` – фактичний вміст повідомлення.
  * `time` – час створення повідомлення.

* **Методи**
  * `toObject()` – повертає `{ body, time }`.
  * `toString()` – форматує час і текст у рядок.
  * `static from(input)` – створює екземпляр з рядка або об’єкта.

### Chat

Розширює `Message`.

* **Властивості**
  * `author` – об’єкт контакту, що представляє відправника повідомлення.
  * `next` – наступне повідомлення в ланцюжку (може бути `null`).

* **Методи**
  * `get size` – повертає довжину ланцюжка.
  * `get recent` – повертає останнє повідомлення в ланцюжку.
  * `toString()` – форматує весь ланцюжок чату.
  * `static from(input)` – будує ланцюжок чату з масивоподібного введення.

### Contact

* **Статичні префікси URI**
  * `Contact.ADDRESS` – `"address:"`
  * `Contact.EMAIL` – `"mailto:"`
  * `Contact.TELEPHONE` – `"tel:"`
  * `Contact.URL` – `"//"`
  * Соціальні мережі: FACEBOOK, INSTAGRAM, LINKEDIN, SIGNAL, SKYPE, TELEGRAM, VIBER, WHATSAPP, X

* **Методи**
  * `toString()` – перетворює контакт в URI-рядок.
  * `static parse(string)` – визначає URI-схему або евристику для визначення типу.
  * `static from(input)` – повертає екземпляр `Contact`, якщо він уже існує, інакше створює новий.

### Language

* **Властивості**
  * `name` – назва мови її рідною мовою.
  * `icon` – емоджі прапора.
  * `code` – код мови за ISO 639-1.
  * `locale` – конкретний ідентифікатор локалі.

* **Методи**
  * `toString()` – об’єднує `name` і `icon`.
  * `static from(input)` – створює або повертає екземпляр `Language`.

### Command

* **Властивості**
  * `name` – назва команди для використання.
  * `help` – опис команди.
  * `options` – набір параметрів команди.
  * `arguments` – набір очікуваних аргументів.
  * `subcommands` – вкладені команди.
  * `aliases` – скорочені назви прапорів.

* **Методи**
  * `addOption(name, type, def, help?, alias?)` – додає параметр команди.
  * `addArgument(name, type, def, help?, required?)` – додає аргумент команди.
  * `addSubcommand(subcommand)` – додає підкоманду.
  * `parse(argv)` – парсить вхідні аргументи та повертає `CommandMessage`.
  * `runHelp()` – генерує та повертає довідку команди.
  * `generateHelp()` – повертає форматований текст довідки.

### CommandMessage

Розширює `Message`.

* **Властивості**
  * `name` – використовується підкомандами.
  * `args` – аргументи команди.
  * `opts` – розібрані прапорці.
  * `children` – вкладені повідомлення підкоманд.

* **Методи**
  * `get subCommand` – повертає назву першої підкоманди, якщо є.
  * `add(message)` – додає повідомлення-нащадка.
  * `toString()` – відтворює повний рядок команди.
  * `static parse(args)` – перетворює масив аргументів у `CommandMessage`.
  * `static from(input)` – повертає вхідне повідомлення або створює нове.

### CommandOption

* **Властивості**
  * `name` – назва параметра.
  * `type` – очікуваний тип значення (`Number`, `String`, `Boolean`, `Array`, `Class`).
  * `def` – значення за замовчуванням, якщо не надано.
  * `help` – текст документації.
  * `alias` – коротке скорочення прапорця.
  * `required` – якщо `true`, то аргумент обов’язковий.

* **Методи**
  * `getDefault()` – повертає `def`.
  * `isOptional()` – повертає `true`, якщо має значення за замовчуванням або не обов’язковий.
  * `toObject()` – формує об’єкт параметра для довідки.
  * `static from()` – приймає необроблену конфігурацію і створює екземпляр.

### CommandError

Розширює `Error`.

* **Властивості**
  * `message` – опис помилки.
  * `data` – додатковий контекст для аналізу.

* **Методи**
  * `toString()` – повертає форматовану помилку з JSON-даними.

Усі експортовані класи повинні проходити основні тести для забезпечення коректності прикладів у API.

## Java•Script

Використовує `.d.ts` файли для автодоповнення

## Пісочниця CLI

Як запустити пісочницю CLI?
```bash
# Клонуйте репозиторій і запустіть CLI-пісочницю
git clone https://github.com/nan0web/co.git
cd i18n
npm install
npm run playground
```

## Внески

Як внести свій вклад? — [читайте тут](./CONTRIBUTING.md)

## Ліцензія

Як застосовується ISC-ліцензія? – [читайте тут](./LICENSE)
