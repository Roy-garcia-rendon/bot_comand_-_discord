const Discord = require("discord.js"); // npm install discord.js
const config = require("../config.json"); // Archivo de configuración.
module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("encuesta")
    .setDescription("Crea una sencilla encuesta.")
    .addStringOption((option) =>
      option
        .setName("pregunta")
        .setDescription("Respuesta de la encuesta.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("respuestas")
        .setDescription("Respuestas de la encuesta separadas por tuberías.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("duracion")
        .setDescription("Duración de la encuesta.")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("seleccion-multiple")
        .setDescription("Permitir la seleccion de multiples respuestas.")
        .setRequired(false)
    ),
  execute: async (interaction) => {
    await interaction.deferReply(); // Deferir la respuesta.
 
    const options = interaction.options.getString("respuestas").split("/"); // Separa las respuestas por tuberías.
    const duracion = interaction.options.getInteger("duracion"); // Obtiene la duración de la encuesta.
    if (duracion >= 1 * 24 * 32) // Si la duración de la encuesta es superior a 32 dias.
      return interaction.reply(
        "La duración de la encuesta no puede ser superior a 32 dias."
      ); // Devuelve un mensaje de error.
      
    const poll = { // Crea la encuesta.
      question: {
        text: interaction.options.getString("pregunta"),
      },
      answers: options.map(answer => ({
        poll_media: {
          text: answer,
        },
      })),
      duration: duracion,
      allow_multiselect:
        interaction.options.getBoolean("seleccion-multiple") || false,
      layout_type: 1,
    };

    await interaction.deleteReply() // Elimina el mensaje de respuesta.

    const rest = new Discord.REST().setToken(config.token);
    await rest.post(Discord.Routes.channelMessages(interaction.channelId), {
      body: { poll },
    }); // Envía la encuesta al canal.

  },
};