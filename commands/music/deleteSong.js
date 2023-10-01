const { SlashCommandBuilder } = require('discord.js');
const { eliminar, deleteSongEmbed } = require("../../global/music");

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

    console.log(res.title);

    interaction.reply({ embeds: [deleteSongEmbed(res.msg, res.title)] });
  },
};
