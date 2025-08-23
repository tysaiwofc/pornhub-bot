import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, AttachmentBuilder } from "discord.js";
import Command from "../../structures/Command.js";
import { generateCard } from '../../utils/PornCard.js';
import { fetchModel } from '../../utils/PornModelExecute.js';

export default class extends Command {
  constructor(client) {
    super(client, {
      name: "pornstar",
      description: "Generate a sexy pornstar card 😏",
      nsfw: true,
      integrationTypes: [0, 1],
      contexts: [0, 1, 2],
      ephemeral: false,
      options: [
        {
          type: 3,
          name: "model",
          description: "Enter the name of the model you want to search for",
          required: true
        }
      ],
    });
  }

  run = async (interaction) => {
    await interaction.deferReply();

    const userId = interaction.user.id;
    const modelName = interaction.options?.getString("model") || "Jane Doe";

    try {
      // --- Buscar dados do modelo ---
      const modelData = await fetchModel(modelName, userId);

      // --- Preparar dados para gerar o card ---
      const cardData = {
        modelName: modelData.name,
        subs: modelData.viewsCount.toLocaleString(),
        age: modelData.age || "N/A",
        country: modelData.country || "N/A",
        avatarPath: modelData.avatar,
        videos: (modelData.videos || []).slice(0, 6).map(v => ({ name: v.name || v.title })),
      };

      // --- Gerar card ---
      const buffer = await generateCard(cardData);
      const attachment = new AttachmentBuilder(buffer, { name: "pornstar_card.png" });

      // --- Criar botão com link para a página do modelo ---
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("🔗 View on Pornhub")
          .setStyle(ButtonStyle.Link)
          .setURL(modelData.url)
      );

      await interaction.editReply({ files: [attachment], components: [row] });

    } catch (err) {
      console.error(err);
      await interaction.editReply("❌ Failed to fetch model or generate the card.");
    }
  };
}
