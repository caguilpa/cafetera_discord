const { SlashCommandBuilder } = require("discord.js");

const play = require("play-dl");

const { v4: uuidv4 } = require("uuid");

const { queue, agregar, nextSong } = require("../../global/music");

const { musicEmbed, queueEmbed } = require("../../global/embeds");

const {
  AudioPlayerStatus,
  getVoiceConnection,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Reproduce una canción")
    .addStringOption((option) =>
      option
        .setName("cancion")
        .setDescription("Cancion / Autor Cancion / Autor")
        .setRequired(true)
    ),
  async execute(interaction) {
    
    //Obtiene el canal de voz del usuario que realiza la interacción
    const vc = interaction.member.voice.channel;

    //No se encuentra en un canal de voz
    if (!vc) {
      return await interaction.reply({
        content: "Debe de estar en un canal de voz",
        ephemeral: true,
      });
    }

    //# BUSQUEDA DE VIDEO
    const ytInfo = await play.search(interaction.options.getString("cancion"));
    const stream = await play.stream(ytInfo[0].url);

    //% Agregar cancion a lista re produccion
    const song = { key: uuidv4(), title: ytInfo[0].title, url: ytInfo[0].url };
    agregar(interaction.guild.id, song);

    //No se encontraron videos para la búsqueda
    if (!ytInfo) {
      return await interaction.reply({
        content: "No se encontraron videos",
        ephemeral: true,
      });
    }

    //& Comprobar que no se este reproduciendo musica
    const pvc = getVoiceConnection(interaction.guild.id);
    if (pvc)
      return interaction.reply({
        embeds: [
          queueEmbed(
            ytInfo[0].title + " (" + ytInfo[0].durationRaw + ")",
            ytInfo[0].url,
            ytInfo[0].thumbnails[0].url,
            ytInfo[0].channel.name,
            ytInfo[0].thumbnail,
            ytInfo[0].channel.url
          ),
        ],
      });

    //Define la conexión al canal de voz
    const voiceConnection = await joinVoiceChannel({
      channelId: vc.id,
      guildId: interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    const resource = createAudioResource(stream.stream, {
      inputType: stream.type,
      metadata: {
        title: ytInfo[0].title,
        key: song.key,
      },
    });

    //Crea el reproductor de audio
    const player = createAudioPlayer();

    //Reproduce la canción
    await player.play(resource);

    //Añade el reproductor a la conexión con el chat de voz
    await voiceConnection.subscribe(player);

    //Montando la respuesta
    const embed = musicEmbed(
      ytInfo[0].title + " (" + ytInfo[0].durationRaw + ")",
      ytInfo[0].url,
      ytInfo[0].channel.name,
      ytInfo[0].thumbnails[0].url,
      ytInfo[0].channel.url,
      ytInfo[0].thumbnails[0].url,
      ytInfo[0].description
    );

    await interaction.reply({ embeds: [embed] });

    //# En cuanto se acabe la musica el reproductor se sale
    // console.log(player.state.resource.metadata.key);
    //% oldS = Recaba informacion de la cancion reproducida
    player.on(AudioPlayerStatus.Idle, async (oldS, newS) => {
      if (
        queue.get(interaction.guild.id).songs.length <= 1 &&
        queue.get(interaction.guild.id).loop == false
      ) {
        voiceConnection.destroy();
        queue.delete(interaction.guild.id);
        return;
      } else {
        return await nextSong(
          interaction.guild.id,
          oldS.resource.metadata.key,
          interaction,
          player,
          voiceConnection,
          "auto"
        );
      }
    });
  },
};
