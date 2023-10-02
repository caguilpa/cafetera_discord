const { getVoiceConnection } = require("@discordjs/voice");
const { queue } = require("../../global/music");
const { stopEmbed } = require("../../global/embeds");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Para el bot de musica"),
  async execute(interaction) {
    const pvc = getVoiceConnection(interaction.guild.id);
    const vc = interaction.member.voice.channel;
    if (!vc) {
      return interaction.reply({
        content: "Tienes que estar en un canal de voz",
        ephemeral: true,
      });
    }

    if (!pvc)
      return interaction.reply({
        content: "El bot no esta reproduciendo musica",
        ephemeral: true,
      });

    if (vc != pvc.joinConfig.channelId) {
      return interaction.reply({
        content: "Tienes que estar en el mismo canal de voz que el bot",
        ephemeral: true,
      });
    }

    const player = pvc.state.subscription.player;

    queue.delete(interaction.guild.id);

    player.stop();
    pvc.destroy();

    await interaction.reply({ embeds: [stopEmbed()] });
  },
};
