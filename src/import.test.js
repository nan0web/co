import { suite, describe, it } from "node:test"
import assert from "node:assert/strict"
import { isConstructible } from "@nan0web/types"
import {
	Command,
	CommandError,
	CommandMessage,
	CommandOption,
	Message,
} from "./index.js"

suite("Import package test", () => {
	describe("Command", () => {
		it("should be defined", () => {
			assert.ok(Command)
			assert.ok(isConstructible(Command))
		})
	})

	describe("CommandError", () => {
		it("should be defined", () => {
			assert.ok(CommandError)
			assert.ok(isConstructible(CommandError))
		})
	})

	describe("CommandMessage", () => {
		it("should be defined", () => {
			assert.ok(CommandMessage)
			assert.ok(isConstructible(CommandMessage))
		})
	})

	describe("CommandOption", () => {
		it("should be defined", () => {
			assert.ok(CommandOption)
			assert.ok(isConstructible(CommandOption))
		})
	})

	describe("Message", () => {
		it("should be defined", () => {
			assert.ok(Message)
			assert.ok(isConstructible(Message))
		})
	})
})