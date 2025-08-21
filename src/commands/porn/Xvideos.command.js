
import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, EmbedBuilder } from "discord.js";
import { fetchModel, stringParaNumeroVisualizacoes } from "../../utils/PornModelExecute.js";
import Command from "../../structures/Command.js";
import { getVideoInformationFromXvideox, getVideosFromXvideox } from "../../utils/XvideosModelExecute.js";

export default class extends Command {
    constructor(client) {
        super(client, {
            name: 'random-xvideos',
            active: false,
            description: "Random video from xvideos.com",
            nsfw: true,
            integrationTypes: [0, 1],
            contexts: [0, 1, 2],
            ephemeral: false,
        })
    }

    run = async (interaction) => {
        await interaction.deferReply()
        const response = await getVideosFromXvideox().catch(() => {})
        console.log(response)
        if(!response) return interaction.editReply({ content: 'Unable to find model, please try again later'})
        const random = response[~~(Math.random() * response.length)]

        //console.log(random)
        const videoInfo = await getVideoInformationFromXvideox(random.path).catch(() => {})
        //console.log(videoInfo.image)


        const embed = new EmbedBuilder()
            .setTitle(String(random.title).slice(0, 80))
            .setDescription(`**Duration:** ${random.duration}`)
            .setImage(videoInfo.image)
            .setColor('#ff0000')
        
        const btn = new ButtonBuilder()
            .setLabel('View')
            .setStyle('Link')
            .setURL(String(random.url).replace('xvideos3', 'xvideos'))

        const row = new ActionRowBuilder()
            .addComponents(btn)

        interaction.editReply({ embeds: [embed], components: [row]})

    }
}