import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, ChannelType } from "discord.js";
import { fetchModel } from "../../utils/PornModelExecute.js";
import Command from "../../structures/Command.js";
import { getImage } from "../../utils/PornImagesExecute.js";
import { saveVideos } from "../../utils/SQLiteDB.js";

export default class extends Command {
    constructor(client) {
        super(client, {
            name: 'pornhub',
            description: "Search for models on pornhub.com",
            nsfw: true,
            integrationTypes: [0, 1],
            contexts: [0, 1, 2],
            options: [
                {
                    type: 3,
                    name: "model",
                    description: "Enter the name of the model you want to search for",
                    required: true
                }
            ],
            ephemeral: false,
        });
    }

    run = async (interaction) => {
        await interaction.deferReply();
        const modelName = interaction.options.getString('model');
        const model = await fetchModel(modelName, interaction.user.id).catch(console.error);
        if (!model) return interaction.editReply({ content: "Unable to find model, please try again later" });

        const getImage2 = await getImage(model?.videos?.map(video => video.src) || []);
        const attachment = new AttachmentBuilder(getImage2, { name: "image.png", description: "Adult Content" });

        const embed = new EmbedBuilder()
            .setImage(`attachment://${attachment.name}`)
            .setColor('#ffa31a')
            .setThumbnail(model.avatar)
            .setDescription(`**Name:** ${model.name}\n **Page:** ${model.url}\n **Total Videos:** ${Number(model.videosCount).toLocaleString('en-US')}\n**Total Views:** ${Number(model.viewsCount).toLocaleString('en-US')}`);

        if (!model?.videos?.length) 
            return interaction.editReply({ content: "I couldn't find any videos of this model" });

 
       // Salva os vídeos e pega os IDs no DB
const indexSaveVideo = await saveVideos(model.videos); // retorna um array de IDs

// Cria os botões usando os IDs do banco
await interaction.editReply({
    embeds: [embed],
    components: [
        new ActionRowBuilder({
            components: indexSaveVideo.slice(0, 4).map((videoId, i) => 
                new ButtonBuilder({
                    style: ButtonStyle.Primary,
                    label: model.videos[i].title.slice(0, 10) + '...',
                    custom_id: `video_${videoId}` // aqui usamos o ID correto
                })
            )
        })
    ],
    files: [attachment],
    fetchReply: true
});


    }
}
