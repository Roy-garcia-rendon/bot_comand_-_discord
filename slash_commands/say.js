const { SlashCommandBuilder, ChatInputCommandInteraction, Client, AttachmentBuilder, } = require('discord.js');
const { profileImage } = require('discord-arts');

module.exports = {
    data: new SlashCommandBuilder()
    
    .setName('profile')
    .setDescription('Este comando permite ver el perfil de un usuario mediante una imagen.')
    .addUserOption(option => option
        .setName('usuario')
        .setDescription('Elige al usuario que quieras ver el perfil.')
        .setRequired(false)
    ),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {

        await interaction.deferReply();

        const user = interaction.options.getUser('usuario') || interaction.user

        const member = await interaction.guild.members.fetch(user.id);
        const presenceStatusMode = member.presence?.status || 'offline';

        const buffer = await profileImage(user.id, {
            badgesFrame: 'true',
            moreBackgroundBlur: 'true',
            backgroundBrightness: 100,
            presenceStatus: presenceStatusMode
            
        });

        interaction.editReply({
            files: [new AttachmentBuilder(buffer)]
        });
        
    }
}