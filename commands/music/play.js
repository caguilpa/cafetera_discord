const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ytdl = require("ytdl-core");
const yts = require("yt-search");

const { v4: uuidv4 } = require("uuid");

const {
  AudioPlayerStatus,
  StreamType,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} = require("@discordjs/voice");

async function videosearch(cancion) {
  const vdE = await yts(cancion);

  return vdE.videos.length > 0 ? vdE.videos[0] : null;
}
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
    //Búsqueda de video
    const vdRepro = await videosearch(interaction.options.getString("cancion"));

    //No se encontraron videos para la búsqueda
    if (!vdRepro) {
      return await interaction.reply({
        content: "No se encontraron videos",
        ephemeral: true,
      });
    }

    //Descarga el audio de youtube
    const stream = await ytdl(vdRepro.url, {
      filter: "audioonly",
      opusEncoded: true,
      encoderArgs: ["-af", "bass=g=5"],
    });

    //Define la conexión al canal de voz
    const voiceConnection = await joinVoiceChannel({
      channelId: vc.id,
      guildId: interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    //Crea el reproductor de audio
    const player = createAudioPlayer();

    //Define el recurso con su tipo
    const resource = createAudioResource(stream, {
      inputType: StreamType.Arbitrary,
    });

    //Añade el reproductor a la conexión con el chat de voz
    await voiceConnection.subscribe(player);

    //Reproduce la canción
    await player.play(resource);

    //Desconecta al bot cuando no este en uso
    player.on(AudioPlayerStatus.Idle, () => voiceConnection.destroy());

    //Montando la respuesta
    const embed = new EmbedBuilder()
      .setColor(0xb6e0d0)
      .setTitle(vdRepro.title)
      .setURL(vdRepro.url)
      .setAuthor({
        name: vdRepro.author.name,
        iconUrl: vdRepro.thumbnail,
        url: vdRepro.author.url,
      })
      .setDescription(vdRepro.description)
      .setImage(vdRepro.image)
      .setTimestamp();

    await interaction.reply({embeds: [embed]});
  },
};
