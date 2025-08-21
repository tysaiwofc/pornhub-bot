import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } from "discord.js";
import Command from "../../structures/Command.js";

export default class extends Command {
  constructor(client) {
    super(client, {
      name: "hotdice",
      description: "Roll the sexy dice and see what action + position you get 😏",
      nsfw: true,
      integrationTypes: [0, 1],
      contexts: [0, 1, 2],
      ephemeral: false,
    });
  }

  run = async (interaction) => {
    await interaction.deferReply();

    const actions = ["Kiss", "Touch", "Lick", "Hug", "Spank", "Tease", "Caress", "Whisper"];
    const positions = ["Missionary", "Doggy Style", "Cowgirl", "Reverse Cowgirl", "Spooning", "69", "Standing", "Lotus"];

    const rollDice = () => ({
      action: actions[Math.floor(Math.random() * actions.length)],
      position: positions[Math.floor(Math.random() * positions.length)]
    });

    let result = rollDice();

    const embed = new EmbedBuilder()
      .setTitle("🎲 Hot Dice Result!")
      .setDescription(`**Action:** ${result.action}\n**Position:** ${result.position}`)
      .setColor("Red")
      .setFooter({ text: `Requested by ${interaction.user.username}` });

    const buttonRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("reroll")
        .setLabel("🎲 Roll Again")
        .setStyle(ButtonStyle.Primary)
    );

    const message = await interaction.editReply({ embeds: [embed], components: [buttonRow] });

    const filter = (i) => i.user.id === interaction.user.id;
    const collector = message.createMessageComponentCollector({ filter, time: 60000 });

    collector.on("collect", async (i) => {
      if (i.customId === "reroll") {
        result = rollDice();

        const newEmbed = new EmbedBuilder()
          .setTitle("🎲 Hot Dice Result!")
          .setDescription(`**Action:** ${result.action}\n**Position:** ${result.position}`)
          .setColor("Red")
          .setFooter({ text: `Requested by ${interaction.user.username}` });

        await i.update({ embeds: [newEmbed], components: [buttonRow] });
      }
    });
  };
}
