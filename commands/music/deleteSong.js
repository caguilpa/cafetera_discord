const { SlashCommandBuilder } = require('discord.js');
const { eliminar } = require("../../global/music");
const { deleteSongEmbed } = require("../../global/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deletesong")
    .setDescription("Elimina una cancion de la lista")
    .addStringOption((option) =>
      option
        .setName("titulo")
        .setDescription("Titulo de la cancion")
        .setRequired(true)
    ),
  async execute(interaction) {
    const res = eliminar(
      interaction.options.getString("titulo"),
      interaction.guild.id
    );

    interaction.reply({ embeds: [deleteSongEmbed(res.msg, res.title)] });
  },
};
