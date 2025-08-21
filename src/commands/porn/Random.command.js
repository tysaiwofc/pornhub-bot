
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from "discord.js";
import { getRandomVideo } from "../../utils/PornModelExecute.js";
import Command from "../../structures/Command.js";

export default class extends Command {
    constructor(client) {
        super(client, {
            name: 'random',
            description: "Receive random videos from pornhub",
            nsfw: true,
            integrationTypes: [0, 1],
            contexts: [0, 1, 2],
            ephemeral: false,
        })
    }

    run = async (interaction) => {
        await interaction.deferReply()
        const response = await getRandomVideo().catch(() => {})
        if(!response) return interaction.editReply({ content: "Unable to find model, please try again later"})

        const embed = new EmbedBuilder()
            .setTitle(response.title?.slice(0, 80))
            .setDescription(`**Views:** ${Number(response.views).toLocaleString('en-US')}\n**Rating:** ${response.rating}\n**Uploader:** [${response.uploader.name}](${response.uploader.url})`) //Onlyfans
            .setImage(response.thumbnail)
            .setColor('#ffa31a')

        const btn = new ButtonBuilder().setLabel('Video').setURL(response.url).setStyle('Link')
        const btn2 = new ButtonBuilder().setLabel('Uploader').setURL(response.uploader.url).setStyle('Link')

        const row = new ActionRowBuilder().addComponents(btn, btn2)
        interaction.editReply({ embeds: [embed], components: [row]})
            
    }
}