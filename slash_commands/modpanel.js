const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("modpanel")
    .setDescription("Modera con este panel")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option => option
        .setName("usuario")
        .setDescription("El usuario el cual recibirá la sanción")
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("razon")
        .setDescription("La razón de tu acción")
        .setRequired(true)
    ),

    async execute (interaction, Client) {
        const {guild, options} = interaction;
        const target = options.getMember("usuario");
        const reason = options.getString("razon") || "No hay una razón.";
        const username = target
        const user = interaction.user.id

        if (target === interaction.user) {
            return await interaction.reply({
                content: "Tu puedes moderar tu mismo!",
                ephemeral: true
            })
        }

        //timeout row
        const tRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("1")
            .setLabel("Por 5 Minutos")
            .setEmoji("⏳")
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId("2")
            .setLabel("Por 10 Minutos")
            .setEmoji("⏳")
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId("3")
            .setLabel("Por 1 Hora")
            .setEmoji("⏲")
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId("4")
            .setLabel("Por 1 Día")
            .setEmoji("⏰")
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId("5")
            .setLabel("Por 1 Semana")
            .setEmoji("🕰")
            .setStyle(ButtonStyle.Primary),
        )

        //mod row
        const Row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("ban")
            .setLabel("Ban")
            .setEmoji("🔨")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("kick")
            .setLabel("Kick")
            .setEmoji("📝")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("untimeout")
            .setEmoji("✅")
            .setLabel("Quitar aislamiento")
            .setStyle(ButtonStyle.Success),
        )

        const embed = new EmbedBuilder()
        .setTitle("Panel de moderación")
        .setColor('Aqua')
        .setImage('https://cdn.discordapp.com/attachments/1235321840138719384/1236833241927909396/standard.gif?ex=66397238&is=663820b8&hm=5dba01f5f2731285fb6bb1791469224ac22f804c623b8e5c18ac0ef57d20c0bb&')
        .setDescription(`Este es el panel de moderación de <@${target.id}>!`)
        .addFields(
            {name: "Nombre", value: `${username}`, inline: true},
            {name: "User ID", value: `${target.id}`, inline: true},
            {name: "Usuario", value: `<@${target.id}>`, inline: true},
            {name: "Avatar URL", value: `[Avatar](${await target.displayAvatarURL()})`, inline: true},
            {name: "Reason", value: `${reason}`, inline: false}
        )
        .setThumbnail(await target.displayAvatarURL())
        .setTimestamp()

        const msg = await interaction.reply({
            embeds: [embed],
            components: [Row, tRow],
            ephemeral: true
        });

        const collector = msg.createMessageComponentCollector();

        const embed3 = new EmbedBuilder()
        .setColor('Aqua')
        .setImage('https://cdn.discordapp.com/attachments/1235321840138719384/1236833241927909396/standard.gif?ex=66397238&is=663820b8&hm=5dba01f5f2731285fb6bb1791469224ac22f804c623b8e5c18ac0ef57d20c0bb&')
        .setTimestamp()
        .setFooter({ text: `Moderador: ${interaction.user.username}`})

        collector.on('collect', async i => {
            if (i.customId === "ban") {
                if (!i.member.permissions.has(PermissionFlagsBits.BanMembers)) {
                    return await i.reply({
                        content: "Tu no puedes darle **BAN** a los miembros!",
                        ephemeral: true
                    })
                }

                await interaction.guild.members.ban(target, {reason});

                embed3.setTitle("Ban").setDescription(`Tu has sido baneado de ${i.guild.name}! || **Razón:** ${reason}`).setColor('Aqua').setImage('https://cdn.discordapp.com/attachments/1235321840138719384/1236833241927909396/standard.gif?ex=66397238&is=663820b8&hm=5dba01f5f2731285fb6bb1791469224ac22f804c623b8e5c18ac0ef57d20c0bb&')

                await target.send({ embeds: [embed3] }).catch(err => {
                    return i.reply({ content: "El error se ha enviado al MD del usuario!", ephemeral: true});
                });;

                await i.reply({ content: `<@${target.id}> ha sido baneado!`, ephemeral: true});
            }

            if (i.customId === "untimeout") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "Tu no tienes permisos para quitar el estado de **aislamiento** a los miembros!", ephemeral: true})
                await target.timeout(null);

                embed.setTitle("Untimeout").setDescription(`Tu has sido quitado del aislamiento en ${i.guild.name}! || **Razón:** ${reason}`).setColor('Aqua').setImage('https://cdn.discordapp.com/attachments/1235321840138719384/1236833241927909396/standard.gif?ex=66397238&is=663820b8&hm=5dba01f5f2731285fb6bb1791469224ac22f804c623b8e5c18ac0ef57d20c0bb&');

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.reply({ content: "El error se ha enviado al MD del usuario!", ephemeral: true});
                });;

                await i.reply({ content: `<@${target.id}> el tiempo de aislamiento ha sido removido ✅.`, ephemeral: true});
            }

            if (i.customId === "kick") {
                if (!i.member.permissions.has(PermissionFlagsBits.KickMembers)) return await i.reply({ content: "Tu no tienes permisos para darle **KICK** a los miembros!", ephemeral: true});

                await interaction.guild.members.kick(target, {reason});

                embed.setTitle("Kick").setDescription(`Tu has recibido kick en ${i.guild.name}! || **Razón:** ${reason}`).setColor('Aqua').setImage('https://cdn.discordapp.com/attachments/1235321840138719384/1236833241927909396/standard.gif?ex=66397238&is=663820b8&hm=5dba01f5f2731285fb6bb1791469224ac22f804c623b8e5c18ac0ef57d20c0bb&')

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.reply({ content: "El error se ha enviado al MD del usuario!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> ha recibido kick!`, ephemeral: true});
            }

            if (i.customId === "1") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "Tu no tienes permisos para poner en **aislamiento** a los miembros!", ephemeral: true});

                await target.timeout(300000, reason).catch(err => {
                    return i.reply({ content: "¡Hubo un error en el tiempo agotado de espera de este miembro!", ephemeral: true });
                });

                embed.setTitle("Timeout").setDescription(`Te han puesto en un tiempo de aislamiento de **5 Minutos** || **Razón:** ${reason}`).setColor('Aqua').setImage('https://cdn.discordapp.com/attachments/1235321840138719384/1236833241927909396/standard.gif?ex=66397238&is=663820b8&hm=5dba01f5f2731285fb6bb1791469224ac22f804c623b8e5c18ac0ef57d20c0bb&');

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.reply({ content: "El error se ha enviado al MD del usuario!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> está en aislamiento por **5 Minutos**`, ephemeral: true});
            }

            if (i.customId === "2") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "Tu no tienes permisos para poner en **aislamiento** a los miembros!", ephemeral: true});

                await target.timeout(600000, reason).catch(err => {
                    return i.reply({ content: "¡Hubo un error en el tiempo agotado de espera de este miembro!", ephemeral: true });
                });

                embed.setTitle("Timeout").setDescription(`Te han puesto en un tiempo de aislamiento de **10 Minutos** || **Razón:** ${reason}`).setColor('Aqua');

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.reply({ content: "El error se ha enviado al MD del usuario!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> está en aislamiento por **10 Minutos**`, ephemeral: true});
            }

            if (i.customId === "3") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "Tu no tienes permisos para poner en **aislamiento** a los miembros!", ephemeral: true});

                await target.timeout(3600000, reason).catch(err => {
                    return i.reply({ content: "¡Hubo un error en el tiempo agotado de espera de este miembro!", ephemeral: true });
                });

                embed.setTitle("Timeout").setDescription(`Te han puesto en un tiempo de aislamiento de *1 Hora** || **Razón:** ${reason}`).setColor('Aqua').setImage('https://cdn.discordapp.com/attachments/1235321840138719384/1236833241927909396/standard.gif?ex=66397238&is=663820b8&hm=5dba01f5f2731285fb6bb1791469224ac22f804c623b8e5c18ac0ef57d20c0bb&');

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.reply({ content: "El error se ha enviado al MD del usuario!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> está en aislamiento por **1 Hora**`, ephemeral: true});
            }

            if (i.customId === "4") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "Tu no tienes permisos para poner en **aislamiento** a los miembros!", ephemeral: true});

                await target.timeout(86400000, reason).catch(err => {
                    return i.reply({ content: "¡Hubo un error en el tiempo agotado de espera de este miembro!", ephemeral: true });
                });

                embed.setTitle("Timeout").setDescription(`Te han puesto en un tiempo de aislamiento de **1 Día** || **Razón:** ${reason}`).setColor('Aqua').setImage('https://cdn.discordapp.com/attachments/1235321840138719384/1236833241927909396/standard.gif?ex=66397238&is=663820b8&hm=5dba01f5f2731285fb6bb1791469224ac22f804c623b8e5c18ac0ef57d20c0bb&')

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.reply({ content: "El error se ha enviado al MD del usuario!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> está en aislamiento por **1 Día**`, ephemeral: true});
            }

            if (i.customId === "5") {
                if (!i.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return await i.reply({ content: "Tu no tienes permisos para poner en **aislamiento** a los miembros!", ephemeral: true});

                await target.timeout(604800000, reason).catch(err => {
                    return i.reply({ content:"¡Hubo un error en el tiempo agotado de aislamiento de este miembro!", ephemeral: true });
                });

                embed.setTitle("Timeout").setDescription(`Te han puesto en un tiempo de aislamiento de **1 Semana** || **Razón:** ${reason}`).setColor('Aqua').setImage('https://cdn.discordapp.com/attachments/1235321840138719384/1236833241927909396/standard.gif?ex=66397238&is=663820b8&hm=5dba01f5f2731285fb6bb1791469224ac22f804c623b8e5c18ac0ef57d20c0bb&')

                await target.send({ embeds: [embed] }).catch(err => {
                    return i.reply({ content: "El error se ha enviado al MD del usuario!", ephemeral: true});
                });

                await i.reply({ content: `<@${target.id}> está en aislamiento por **1 Semana**`, ephemeral: true});
            }

            
        })
    }
}