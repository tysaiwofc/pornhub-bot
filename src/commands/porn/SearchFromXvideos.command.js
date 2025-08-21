
import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, EmbedBuilder } from "discord.js";
import Command from "../../structures/Command.js";
import { fetchVideosFromXvideox, getVideoInformationFromXvideox } from "../../utils/XvideosModelExecute.js";


export function stringParaNumeroVisualizacoes(params) {
    const string = String(params[0])
    // Remova todos os caracteres que não são números ou ponto
    const numeroString = string.replace(/[^\d.]/g, '');

    // Converta a string para um número
    let numero = parseFloat(numeroString);

    // Verifique se há "M" para multiplicar o número por 1 milhão

    if (string.toLowerCase().includes('b')) {
        numero *= 10000000;
    }
    if (string.toLowerCase().includes('m')) {
        numero *= 1000000;
    }

    if(string.toLowerCase().includes("k")) {
        numero *= 100000
    }

    return numero;
}

export default class extends Command {
    constructor(client) {
        super(client, {
            name: 'xvideos',
            active: false,
            description: "Search for videos on xvideos.com",
            nsfw: true,
            integrationTypes: [0, 1],
            contexts: [0, 1, 2],
            options: [
                {
                    type: 3,
                    name: "video",
                    description: "Enter your param",
                    required: true
                }
            ],
            ephemeral: false,
        })
    }

    run = async (interaction) => {
        await interaction.deferReply()
        const param = interaction.options.getString('video')
        const video = await fetchVideosFromXvideox(param).catch(() => {})
      
        if(!video) return interaction.editReply({ content: "Unable to load page."})
        const videoInformation = await getVideoInformationFromXvideox(video.path).catch(() => {}) 
        const embed = new EmbedBuilder()
            .setTitle(String(video.title).slice(0, 80))
            .setImage(videoInformation.image)
            .setDescription(`**Id:** ${video.id}\n**Views:** ${Number(stringParaNumeroVisualizacoes(String(videoInformation.views))).toLocaleString('en-US')}`)
            .setFooter({ text: `Quality: ${video.quality}`})
            .setColor('#ff0000')

          
        const btn = new ButtonBuilder()
            .setLabel('View')
            .setStyle('Link')
            .setURL(String(video.url).replace('xvideos3', 'xvideos'))

        const row = new ActionRowBuilder().addComponents(btn)

        await interaction.editReply({ embeds: [embed], components: [row]})
    }
}