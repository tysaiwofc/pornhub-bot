import Command from "../../structures/Command.js";

export default class extends Command {
    constructor(client) {
        super(client, {
            name: 'interactionCreate',
        })
    }

    run = async (interaction) => {
        const cmd = this.client.commands.find(c => c.name === interaction?.commandName);
        const component = this.client.components.find(c => 
            c.id === interaction.customId || interaction.customId.startsWith("video_") || interaction.customId.includes("_")
        );

        if (cmd) {
            const isNsfwAllowed = interaction.channel?.nsfw || !interaction.guild;
            if (cmd.name !== 'help' && !isNsfwAllowed) {
                return interaction.reply({ 
                    content: ":x: This command can only be used on NSFW channels.", 
                    ephemeral: true 
                });
            }

            try {
                return cmd.run(interaction);
            } catch (error) {
                this.client.log.warn('INTERACTION', error);
                return interaction.reply({ 
                    content: "Something went wrong while processing your interaction.", 
                    ephemeral: true 
                }).catch(() => {});
            }
        }

        if (component) {
            const isVideoComponent = interaction.customId.startsWith("video_") || interaction.customId.startsWith("korean_");
            
            try {
                if (isVideoComponent) {
                    const id = parseInt(interaction.customId.split("_")[1]);
                    return component.run(interaction, id);
                }
                return component.run(interaction);
            } catch (error) {
                console.log(error);
                return interaction.reply({ 
                    content: "Something went wrong while processing your interaction.", 
                    ephemeral: true 
                }).catch(() => {});
            }
        }

        return interaction.reply({ 
            content: "Something went wrong while processing your interaction.", 
            ephemeral: true 
        }).catch(() => {});
    }
}