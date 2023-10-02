const { EmbedBuilder } = require("discord.js");

const baseEmbedIcon = () => {
  return new EmbedBuilder().setThumbnail("https://i.imgur.com/i9a2DfQ.png");
};

//Musica en reproduccion
const musicEmbed = (
  title,
  url,
  authorName,
  thumbnail,
  authorUrl,
  image,
  description
) => {
  return baseEmbedIcon()
    .setColor(0xb6e0d0)
    .setTitle(title)
    .setURL(url)
    .setAuthor({
      name: authorName,
      iconUrl: thumbnail,
      url: authorUrl,
    })
    .setDescription(description)
    .setImage(image)
    .setTimestamp();
};

//Borrar canción
const deleteSongEmbed = (message, title) => {
  return new EmbedBuilder()
    .setColor(0xe0001a)
    .setTitle(message)
    .setDescription(title);
};

//Parar la reproducción
const stopEmbed = () => {
  return new EmbedBuilder()
    .setColor(0xe0001a)
    .setTitle("Reproducción eliminada");
};

//Actualizar cola
const queueEmbed = (title, url, image, authorName, thumbnail, authorUrl) => {
  return baseEmbedIcon()
    .setColor(0x9dd4ab)
    .setTitle(title)
    .setURL(url)
    .setAuthor({
      name: authorName,
      iconUrl: thumbnail,
      url: authorUrl,
    })
    .setDescription("Queue Actualizada")
    .setImage(image)
    .setTimestamp();
};

//Mostrar lista de reproducción
const listQueueEmbed = (songs) => {
  return baseEmbedIcon()
    .setTitle("Lista de reproduccion")
    .setDescription("Lista de reproduccion:\n\n" + songs.join(""))
    .setColor(0x64526e);
};

module.exports = {
  musicEmbed,
  queueEmbed,
  deleteSongEmbed,
  stopEmbed,
  listQueueEmbed,
};
