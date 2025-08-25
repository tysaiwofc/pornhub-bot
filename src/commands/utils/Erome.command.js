import Command from "../../structures/Command.js";
import { fetchEromeMedia, CATEGORY_ID } from "../../utils/Erome.js";
import { PermissionsBitField, ChannelType } from "discord.js";
import { createWriteStream } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pipeline } from "node:stream";
import { promisify } from "node:util";

const streamPipeline = promisify(pipeline);

// Replace with your Discord ID
const ALLOWED_USER_ID = "280879353292914700";

// Delay function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to download file
async function downloadFile(url, filename) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to download ${url}`);
    const path = join(tmpdir(), filename);
    await streamPipeline(response.body, createWriteStream(path));
    return path;
}

export default class extends Command {
    constructor(client) {
        super(client, {
            type: 1,
            name: "erome",
            description: "Posts media from an Erome link into a new or existing NSFW channel",
            user_permissions: [PermissionsBitField.Flags.ManageChannels],
            options: [
                
                {
                    type: 3, // STRING
                    name: "url",
                    description: "The Erome URL",
                    required: true
                },
                {
                    type: 3, // STRING
                    name: "name",
                    description: "The name of the channel to create",
                    required: false
                },
                {
                    type: 7, // CHANNEL
                    name: "channel",
                    description: "An existing text channel to use",
                    required: false
                }
            ],
            interactionOnly: true,
            nsfw: true,
        });
    }

    async run(interaction) {
        if (interaction.user.id !== ALLOWED_USER_ID) {
            return interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
        }

        const channelName = interaction.options.getString("name");
        const targetChannel = interaction.options.getChannel("channel");
        const eromeUrl = interaction.options.getString("url");

        const guild = interaction.guild;
        let channel;

        if (targetChannel) {
            // Usar canal existente
            if (targetChannel.type !== ChannelType.GuildText) {
                return interaction.reply({ content: "The selected channel must be a text channel.", ephemeral: true });
            }
            if (!targetChannel.nsfw) {
                await targetChannel.setNSFW(true, "Marked as NSFW for Erome content");
            }
            channel = targetChannel;
            await interaction.reply({ content: `Using existing NSFW channel: ${channel}`, ephemeral: true });
        } else {
            // Criar novo canal
            if (!channelName) {
                return interaction.reply({ content: "You must provide a channel name if no channel is selected.", ephemeral: true });
            }

            const category = guild.channels.cache.get(CATEGORY_ID);
            if (!category || category.type !== ChannelType.GuildCategory) {
                return interaction.reply({ content: "Invalid category.", ephemeral: true });
            }

            channel = await guild.channels.create({
                name: channelName,
                type: ChannelType.GuildText,
                parent: category.id,
                nsfw: true,
            });

            await interaction.reply({ content: `Created NSFW channel: ${channel}`, ephemeral: true });
        }

        // Baixar e enviar mídias
        const media = await fetchEromeMedia(eromeUrl);
        const total = media.reduce((acc, item) => acc + (item.type === "video" ? item.sources.length : 1), 0);
        let count = 0;
        const delayMs = 2000;

        for (const item of media) {
            try {
                if (item.type === "image") {
                    const filePath = await downloadFile(item.src, `SPOILER_image-${Date.now()}.jpg`);
                    await channel.send({ files: [{ attachment: filePath, spoiler: true }] });
                    count++;
                    console.log(`Progress: ${count}/${total} (${((count / total) * 100).toFixed(2)}%)`);
                    await delay(delayMs);
                } else if (item.type === "video") {
                    for (const src of item.sources) {
                        const filePath = await downloadFile(src.src, `SPOILER_video-${Date.now()}.mp4`);
                        await channel.send({ files: [{ attachment: filePath, spoiler: true }] });
                        count++;
                        console.log(`Progress: ${count}/${total} (${((count / total) * 100).toFixed(2)}%)`);
                        await delay(delayMs);
                    }
                }
            } catch (err) {
                console.error("Error sending media:", err);
            }
        }

        console.log("All media sent!");
    }
}
