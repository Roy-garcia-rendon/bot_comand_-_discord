const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gey')
    .setDescription('Calcula el porcentaje de cuánto eres de gey')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Elige un usuario para ver cuánto porcentaje tiene de gey')
        .setRequired(false)
    ),

  async execute(interaction) {
    const usuario = interaction.options.getUser('usuario') || interaction.user;

    const porcentajes = ['5%', '10%', '15%', '20%', '25%', '30%', '35%', '40%', '45%', '50%', '55%', '60%', '65%', '70%', '75%', '80%', '85%', '90%', '95%', '100%'];
    const porcentajeGey = porcentajes[Math.floor(Math.random() * porcentajes.length)];

    const embed = new EmbedBuilder()
      .setColor('#FF69B4') // Un color rosado que es alegre y llamativo
      .setTitle('🌈 ¿Qué tan gey eres? 🌈')
      .setThumbnail('https://media.tenor.com/images/3b1b4f6a447c8b10a5270c7b29b9e75f/tenor.gif') // Un GIF o imagen relacionado
      .addFields(
        { name: 'Usuario:', value: `${usuario}`, inline: true },
        { name: 'Porcentaje de Gey:', value: `${porcentajeGey}`, inline: true }
      )
      .setFooter({ text: 'Esto es solo por diversión, ¡no te lo tomes en serio!' });

    await interaction.reply({ embeds: [embed], ephemeral: false });
  },
};
