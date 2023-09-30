const { SlashCommandBuilder } = require("discord.js");
const ytdl = require("ytdl-core");
const yts = require("yt-search");

const {
  AudioPlayer,
  StreamType,
  createAudioPlayer,
  createAudioResource,
  entersState,
  joinVoiceChannel,
  getVoiceConnection,
  VoiceConnectionStatus,
  AudioPlayerStatus,
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
    const stream = await ytdl(vdRepro.url, { filter: "audioonly" });

    //Define la conexión al canal de voz
    const voiceConnection = await joinVoiceChannel({
      channelId: vc.id,
      guildId: interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    const connection = await getVoiceConnection(interaction.guildId);
    
    //Crea el reproductor de audio
    const player = createAudioPlayer();
    
    
    //Define el recurso con su tipo
    const resource = await createAudioResource(stream, {
      inputType: StreamType.Arbitrary,
    });
    
    try {
    
    await entersState(voiceConnection, VoiceConnectionStatus.Ready, 5000);
    
    console.log("Connected");
    
    } catch (error) {
    
    console.log("Voice Connection not ready within 5s.", error);
    
    return null;
    
    }

    await connection.subscribe(player);


    player.on(AudioPlayerStatus.Playing, () => {
      console.log('The audio player has started playing!');
    });

    player.on('error', error => {
      console.error('Error:', error.message);
    });
    
    await player.play(resource);


















    /*const voiceChannel = interaction.options.getChannel('channel');

    const voiceConnection = joinVoiceChannel({
    
    channelId: voiceChannel.id,
    
    guildId: interaction.guildId,
    
    adapterCreator: interaction.guild.voiceAdapterCreator,
    
    })
    
    const connection = getVoiceConnection(interaction.guildId);
    
    const player = createAudioPlayer();
    
    const resource = createAudioResource('G:\file.mp3');
    
    try {
    
    await entersState(voiceConnection, VoiceConnectionStatus.Ready, 5000);
    
    console.log("Connected: " + voiceChannel.guild.name);
    
    } catch (error) {
    
    console.log("Voice Connection not ready within 5s.", error);
    
    return null;
    
    }
    
    connection.subscribe(player);
    
    player.play(resource);


*/











    
    await interaction.reply({
      content: `Reproduciendo: ${vdRepro.title}`,
    });
  },
};
