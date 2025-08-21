

import Command from "../../structures/Command.js";
import c from 'colors'

export default class extends Command {
    constructor(client) {
        super(client, {
            name: 'ready',
        })
    }

    run = async () => {

        await this.client.registryCommands()
        this.client.user.setPresence({ activities: [{ name: 'developed by tysaiw.com' }], status: 'online' });
        console.log(`\x1b[32m[ ${c.white(c.bold('Bot'))} \x1b[32m] ${c.magenta(`Discord bot logged on ${this.client.user.username}#${this.client.user.discriminator}`)}`)

    }
}