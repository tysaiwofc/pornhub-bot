import { ActionRowBuilder, ButtonBuilder } from "discord.js";
import Command from "../../structures/Command.js";

export default class extends Command {
    constructor(client) {
        super(client, {
            name: 'messageCreate',
        })
    }

    run = async (message) => {

        if(message.content === `<@${message.client.user.id}>` && !message.channel.nsfw || message.content === `<@!${message.client.user.id}>` && !message.channel.nsfw) {
            message.reply({ content: `My commands can only be used on NSFW channels, to discover my commands just type </help:1252018007459369107>`}).then(msg => {
                setTimeout(() => {
                    msg?.delete().catch(() => {})
                }, 5000)
            })
        } else if(message.content === `<@${message.client.user.id}>` || message.content === `<@!${message.client.user.id}>`) {
            const btn = new ButtonBuilder()
                .setStyle('Link')
                .setLabel('Add App')
                .setURL('https://discord.com/oauth2/authorize?client_id=1239656247658287155')

            const row = new ActionRowBuilder()
                .addComponents(btn)
            
            message.reply({ content: `Hello, my commands only work on age-restricted channels, use </help:1252018007459369107> to see what I can do`, components: [row]}).then(msg => {
                setTimeout(() => {
                    msg?.delete().catch(() => {})
                }, 5000)
            })
        }
        
    }
}