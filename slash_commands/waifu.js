const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
module.exports = {
  data: new SlashCommandBuilder()
    .setName('getwaifu')
    .setDescription('Genera tu waifu')
    .addStringOption(option => 
        option.setName('categoria')
            .setDescription('Seleccione su categoria')
            .setRequired(true)
            .addChoices(
        {name:'Waifu', value:'waifu'},
            {name:'Maid',value:'maid'},
            {name:'Marin Kitagawa', value:'marin-kitagawa'},
            {name:'Mori Calliopea',value: 'mori-calliope'},
            {name:'Raiden Shogun', value:'raiden-shogun'},
            {name:'Oppai',value: 'oppai'},
            {name:'Selfies', value:'selfies'},
            {name:'Uniform', value:'uniform'})),
  async execute(interaction) {

    const type = interaction.options.getString('categoria');
    const body = await fetch(`https://api.waifu.im/search/?included_tags=${type}`).then(res => res.json());

    const embed = new EmbedBuilder()
      .setTitle('Hola soy tu waifu ♥️')
      .setColor('DarkButNotBlack')
      .setFooter({text:interaction.user.username,iconURL: interaction.member.displayAvatarURL({ dynamic: true })})
      .setTimestamp()
      .setImage(body.images[0].url);

    interaction.reply({ embeds: [embed] });

    const message = await interaction.fetchReply();
    await message.react('<:tabien:1281775676210417684>');
    await message.react('<:no:1281775701338488883>');
 
    }
};