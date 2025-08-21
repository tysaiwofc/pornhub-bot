import Command from "../../structures/Command.js";

export default class extends Command {
    constructor(client) {
        super(client, {
            name: 'interactionCreate',
        })
    }

    run = async (interaction) => {

        //console.log(interaction.id)

        const cmd = this.client.commands.find(command => command.name === interaction?.commandName)
        const component = this.client.components.find(comp => comp.id === interaction?.customId)


        if(cmd) {
            if(cmd.name !== 'help' && !interaction?.channel?.nsfw && interaction.guild) return interaction.reply({ content: ":x: This command can only be used on NSFW channels.", ephemeral: true})
          try {
                cmd.run(interaction)
            } catch (er) {
                this.client.log.warn('INTERACTION', er)
                interaction.client.sendInteraction(interaction, { content: "<:error:1105719628459692143>", ephemeral: true }).catch(() => {})
                
            }
        } else if(component) {
          
            try {
                component.run(interaction)
            } catch (er) {
                this.client.log.warn('INTERACTION', er)
                interaction.client.sendInteraction(interaction, { content: "<:error:1105719628459692143>", ephemeral: true }).catch(() => {})
                
            }
        
        }
        
    }
}