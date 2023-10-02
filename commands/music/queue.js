const { SlashCommandBuilder } = require("discord.js");

const { listQueueEmbed } = require("../../global/embeds");

const { getVoiceConnection } = require("@discordjs/voice");

const { fullQueue } = require("../../global/music");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Muestra la lista de reproduccion"),
  async execute(interaction) {
    const pvc = getVoiceConnection(interaction.guild.id);

    if (!pvc) return interaction.reply("No se esta reproduciendo musica");

    const songs = fullQueue(interaction.guild.id);

    interaction.reply({ embeds: [listQueueEmbed(songs)] });
  },
};
