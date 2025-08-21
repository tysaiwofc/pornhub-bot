import { Client, Collection } from "discord.js";

import Debugger from "./Debugger.js";
import { readdirSync} from 'node:fs'
import { URL } from 'url';
const __dirname = new URL('../../', import.meta.url).pathname;
export default class Bot extends Client {
    constructor(options) {
        super(options);
        this.commands = new Array()
        this.components = new Array()
        this.events = new Array()
        this.log = new Debugger()
        this.#loadEvents()
        this.#loadCommands()
        this.#loadComponents()
    }

    async registryCommands() {
        await this.application.commands.set(this.commands)
        this.log.log('Bot', 'Comandos registrados com sucesso!')
    }

    async #loadCommands(path = 'src/commands') {
        const categories = readdirSync(path)
        for (const category of categories) {
            const commands = readdirSync(`${path}/${category}`)
            for (const command of commands) {
                const commandClass = await import(`${__dirname}/src/commands/${category}/${command}`)

                const cmd = new (commandClass.default)(this)
                
                this.commands.push(cmd)
            }
        }

        this.log.log('Bot', 'Comandos foram carregados')
    }

    async #loadEvents(path = 'src/events') {
        const categories = readdirSync(path)
        for (const category of categories) {
            const commands = readdirSync(`${path}/${category}`)
            for (const command of commands) {
                const commandClass = await import(`${__dirname}/src/events/${category}/${command}`)
                const cmd = new (commandClass.default)(this)
                
                this.on(cmd.name, cmd.run)
            }
        }

        this.log.log('Bot', 'Eventos foram carregados')
    }

    async #loadComponents(path = 'src/components') {
        const categories = readdirSync(path)
        for (const category of categories) {
            const commands = readdirSync(`${path}/${category}`)
            for (const command of commands) {
                const commandClass = await import(`${__dirname}/src/components/${category}/${command}`)
                const cmd = new (commandClass.default)(this)
                
                this.components.push(cmd)
            }
        }

        this.log.log('Bot', 'Components foram carregados')
    }
}