const { SlashCommandBuilder } = require('discord.js');

const { getVoiceConnection } = require("@discordjs/voice");

const { previousSong } = require("../../global/music");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('previous')
		.setDescription('Regresa la cancion'),
	async execute(interaction) {
		const mvc = interaction.member.voice.channel.id;
    const pvc = getVoiceConnection(interaction.guild.id);

    if (!pvc) return interaction.reply("No se esta reproduciendo musica");

    if (mvc != pvc.joinConfig.channelId) {
      return interaction.reply("Tienes que estar en el mismo canal de voz");
    }

    const player = getVoiceConnection(interaction.guild.id).state.subscription
      .player;

    previousSong(
      interaction.guild.id,
      player.state.resource.metadata.key,
      interaction,
      player,
      pvc
    );
	},
};