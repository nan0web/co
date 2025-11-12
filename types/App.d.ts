/**
 * @typedef {Object} AppConfig
 * @property {DB} db
 * @property {Logger} logger
 */
export default class App {
    static InputMessage: typeof InputMessage;
    static OutputMessage: typeof OutputMessage;
    /**
     * @param {Partial<AppConfig>} [config={}]
     */
    constructor(config?: Partial<AppConfig> | undefined);
    get InputMessage(): typeof InputMessage;
    get OutputMessage(): typeof OutputMessage;
    get db(): DB;
    get logger(): Logger | NoLogger;
    /**
     * @param {InputMessage} msg
     * @returns {AsyncGenerator<OutputMessage>}
     */
    run(msg: InputMessage): AsyncGenerator<OutputMessage>;
    /**
     * @param {string} event
     * @param {any} data
     * @returns {Promise<EventContext>}
     */
    emit(event: string, data: any): Promise<EventContext<any>>;
    /**
     * @param {string} event
     * @param {import("@nan0web/event/types/types").EventListener} fn
     */
    on(event: string, fn: import("@nan0web/event/types/types").EventListener): void;
    /**
     * @param {string} event
     * @param {import("@nan0web/event/types/types").EventListener} fn
     */
    off(event: string, fn: import("@nan0web/event/types/types").EventListener): void;
    #private;
}
export type AppConfig = {
    db: DB;
    logger: Logger;
};
import InputMessage from "./InputMessage.js";
import OutputMessage from "./OutputMessage.js";
import DB from "@nan0web/db";
import Logger from "@nan0web/log";
import { NoLogger } from "@nan0web/log";
import { EventContext } from "@nan0web/event";
