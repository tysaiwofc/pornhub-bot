
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "discord.js";

import Command from "../../structures/Command.js";

export default class extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            description: "Learn more about my commands",
            nsfw: false,
            ephemeral: false,
        })
    }

    run = async (interaction) => {
        await interaction.deferReply()
        const embed = new EmbedBuilder()
            .setTitle('How to use my commands?')
            .setDescription(`Hello, here is a mini tutorial on how to use my commands, my commands have some types of arguments that include "video", "model", "celebrity".\n\n\`celebrity\` - is the name of the celebrity, that is, an influential or famous person (non-porn actress).\n\`video\` - any video name you want to search for.\n\`model\` - name of a famous porn actress.\n\n**Commands**\n\n</pornhub:1252018007459369104> - Find pornhub actresses\n</random:1252018007459369103> - random pornhub actress\n</random-xvideos:1252018007459369106> - receive a random video from xvideos.com\n</xvideos:1252018007459369105> - search for videos on xvideos.com`) //Onlyfans
            .setImage('https://i.imgur.com/ebEcqV4.png')
            .setColor('#ffa31a')

        interaction.editReply({ embeds: [embed]})
            
    }
}