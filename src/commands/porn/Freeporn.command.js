import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType } from "discord.js";
import Command from "../../structures/Command.js";
import { getModelInfo } from "../../utils/FreePornVideos.js";
import { getImage } from "../../utils/PornImagesExecute.js";

export default class extends Command {
    constructor(client) {
        super(client, {
            name: 'freeporn',
            description: "Search for a pornstar by name",
            nsfw: true,
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "name",
                    description: "Enter the pornstar's name",
                    required: true
                }
            ],
            integrationTypes: [0, 1],
            contexts: [0, 1, 2],
            ephemeral: false,
        });
    }

    run = async (interaction) => {
        await interaction.deferReply();
        const name = interaction.options.getString('name');

        let modelData;
        try {
            modelData = await getModelInfo(name.toLowerCase().replace(/\s+/g, "-"));
        } catch (err) {
            console.error(err);
            return interaction.editReply("❌ Could not fetch model info. Make sure the name is correct.");
        }

        if (!modelData || modelData.videos.length === 0) {
            return interaction.editReply("❌ No videos found for this model.");
        }

        const thumbnails = modelData.videos.map(v => v.thumbnail).filter(Boolean).slice(0, 4);
        const buffer = await getImage(thumbnails); 
        const attachment = new AttachmentBuilder(buffer, { name: "image.png" });

        const buttons = modelData.videos.slice(0, 4).map(video =>
    new ButtonBuilder({
        style: ButtonStyle.Link,
        label: video.title.slice(0, 15) + '...',
        url: video.href 
    })
);

        await interaction.editReply({
            content: `**Name:** ${modelData.modelName}\n**Total Views:** ${Number(modelData.totalViews).toLocaleString('en-US')}`,
            components: [
                new ActionRowBuilder({ components: buttons })
            ],
            files: [attachment]
        });
    }
}
