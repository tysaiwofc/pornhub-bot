import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType } from "discord.js";
import Command from "../../structures/Command.js";
import { getModelInfo } from "../../utils/FreePornVideos.js";
import { generateCard } from "../../utils/generateFreeCard.js"; // seu generateCard atualizado

export default class extends Command {
    constructor(client) {
        super(client, {
            name: 'free-pornstar',
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

        const videosForCard = modelData.videos.slice(0, 6);


        const buffer = await generateCard({
            modelName: modelData.modelName,
            subs: Number(modelData.totalViews).toLocaleString('en-US'),
            age: "N/A", 
            country: "N/A", 
            avatarPath: modelData.imgSrc,
            videos: videosForCard.map(v => ({ name: v.title }))
        });

        const attachment = new AttachmentBuilder(buffer, { name: "model_card.png" });

 

        await interaction.editReply({
            components: [new ActionRowBuilder({ components: [new ButtonBuilder()
          .setLabel("🔗 View on FreePornVideos")
          .setStyle(ButtonStyle.Link)
          .setURL(modelData.url)] })],
            files: [attachment]
        });
    }
}
