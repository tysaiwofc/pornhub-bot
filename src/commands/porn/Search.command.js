import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, ChannelType } from "discord.js";
import { fetchModel } from "../../utils/PornModelExecute.js";
import Command from "../../structures/Command.js";
import { getImage } from "../../utils/PornImagesExecute.js";

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

 

        const message = await interaction.editReply({ embeds: [embed], components: [new ActionRowBuilder({
            components: model.videos.slice(0, 4).map((video, index) => new ButtonBuilder({ style: ButtonStyle.Primary, label: video.title.slice(0, 10) + '...', custom_id: `video_${index}` }))
        })], files: [attachment], fetchReply: true });

        // Criar listener para os botões
        const filter = i => i.user.id === interaction.user.id;
        const collector = message.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            const index = parseInt(i.customId.split('_')[1]);
            const videoClicked = model.videos[index];
            
            // Atualiza a mensagem removendo os botões
            await i.update({ components: [new ActionRowBuilder({
                components: [
                new ButtonBuilder({
                    custom_id: `videocreated_${index}`,
                    label: `Thread Created By ${interaction.user.username}`,
                    style: ButtonStyle.Secondary,
                    disabled: true
                })
                ]
            })] });

            // Cria um tópico com o nome do botão
            if (i.channel.type === ChannelType.GuildText) {

             const thread = await i.message.startThread({
    name: `Video: ${videoClicked.title.slice(0, 30)}`, // thread name
    autoArchiveDuration: 60, // minutes before auto-archive
    reason: `Thread created for video ${videoClicked.title}`,
    type: 11, // GUILD_PUBLIC_THREAD
});

await thread.send({
    content: `<:morango:1162694146717397063> | ${interaction.user} Hello! This channel has been created to discuss the video **${videoClicked.title}** in a respectful manner. Please be courteous and considerate while participating. Feel free to share thoughts, comments, and ideas relevant to the video!`,
    components: [new ActionRowBuilder({
        components: [
            new ButtonBuilder({

                label: `Watch ${String(videoClicked.title).slice(0, 10)}`,
                style: ButtonStyle.Link,
                url: videoClicked.href
            })
        ]
    })]
});

            }
        });
    }
}
