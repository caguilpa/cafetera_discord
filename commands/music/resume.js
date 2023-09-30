const { SlashCommandBuilder } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Reanuda el reproductor"),
  async execute(interaction) {
    //Obtiene el canal de voz del bot
    const pvc = getVoiceConnection(interaction.guild.id);

    //Obtiene el canal de voz del usuario que realiza la interacción
    const vc = interaction.member.voice.channel;

    //No se encuentra en un canal de voz el usuario
    if (!vc) {
      return await interaction.reply({
        content: "Debe de estar en un canal de voz",
        ephemeral: true,
      });
    }

    //No se encuentra en un canal de voz el bot
    if (!pvc) {
      return await interaction.reply({
        content: "El bot no esta reproduciendo musica",
        ephemeral: true,
      });
    }

    //No se encuentra en el mismo canal de voz que el bot
    if (vc != pvc.joinConfig.channelId) {
      return await interaction.reply({
        content: "Tienes que estar en el mismo canal de voz que el bot",
        ephemeral: true,
      });
    }

    //Obtiene el reproductor y lo reanuda
    const player = pvc.state.subscription.player;

    player.unpause();

    await interaction.reply("Bot reanudado");

  },
};