import Component from "../../structures/Component.js";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } from "discord.js";

export default class extends Component {
    constructor(client) {
        super(client, {
            type: "BUTTON",
            customId: `korean_`,
            run: async (interaction, id) => {
                const db = (await import("../../utils/SQLiteDB.js")); 
                const { getVideo } = db;
                const video = getVideo(id);
                if (!video) {
                    return interaction.reply({ content: "Esse vídeo não está mais disponível!", ephemeral: true });
                }

                await interaction.update({
                    components: [
                        new ActionRowBuilder({
                            components: [
                                new ButtonBuilder()
                                    .setCustomId(`videocreated_22222`)
                                    .setLabel(`Thread Created By ${interaction.user.username}`)
                                    .setStyle(ButtonStyle.Secondary)
                                    .setDisabled(true)
                            ],
                            
                        })
                    ],
                    content: `${video.title}`
                });


                if (interaction.channel.type === ChannelType.GuildText) {
                    const thread = await interaction.message.startThread({
                        name: `Video: ${video.title.slice(0, 30)}`,
                        autoArchiveDuration: 60,
                        reason: `Thread created for video ${video.title.slice(0, 30)}`,
                        type: 11,
                    });

                    await thread.send({
                        content: `<:morango:1162694146717397063> | ${interaction.user} Hello! This channel has been created to discuss the video **${video.title}** in a respectful manner.`,
                        components: [
                            new ActionRowBuilder({
                                components: [
                                    new ButtonBuilder()
                                        .setLabel(`Watch ${String(video.title).slice(0, 30)}`)
                                        .setStyle(ButtonStyle.Link)
                                        .setURL(video.url)
                                ]
                            })
                        ]
                    });
                }
            }
        });
    }
}
