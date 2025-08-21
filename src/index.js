import Bot from './structures/Client.js'
import { IntentsBitField } from 'discord.js'
import { config } from 'dotenv'
config()

const client = new Bot({
    intents: [ 
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMessages,
    ]
})



client.login(process.env.TOKEN)

process.on('unhandledRejection', (error) => {
    console.error(error);
});

process.on('uncaughtException', (error) => {
    console.error(error);
});