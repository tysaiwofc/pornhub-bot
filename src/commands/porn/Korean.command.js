import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType } from "discord.js";
import Command from "../../structures/Command.js";
import { getImage } from "../../utils/PornImagesExecute.js";
import { saveVideos } from "../../utils/SQLiteDB.js";
import { getVideosKorean } from "../../utils/KoreanSexExecute.js";

export default class extends Command {
    constructor(client) {
        super(client, {
            name: 'korean',
            description: "Search for korean porn in pornhub.com",
            nsfw: true,
            options: [
                {
                    type: ApplicationCommandOptionType.Number,
                    name: "page",
                    description: "Enter the page number",
                    required: false,
                    maxValue: 99,
                    minValue: 2
                }
            ],
            integrationTypes: [0, 1],
            contexts: [0, 1, 2],
            ephemeral: false,
        });
    }

    run = async (interaction) => {
        await interaction.deferReply();
        const page = interaction.options.getNumber('page') || 0
        const korean = await getVideosKorean(page)
        const getImage2 = await getImage(korean?.map(video => video.thumbnail) || []);
        const attachment = new AttachmentBuilder(getImage2, { name: "image.png", description: "Adult Content" });
        const indexSaveVideo = await saveVideos(korean); 

        await interaction.editReply({
            components: [
                new ActionRowBuilder({
                    components: indexSaveVideo.slice(0, 4).map((videoId, i) =>
                        new ButtonBuilder({
                            style: ButtonStyle.Primary,
                            label: korean[i].title.slice(0, 10) + '...',
                            custom_id: `korean_${videoId}`
                        })
                    )
                })
            ],
            files: [attachment],
            fetchReply: true
        });



    }
}
