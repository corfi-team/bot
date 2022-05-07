const { MessageEmbed } = require('discord.js');

exports.run = async (client, channel) => {
try {
    const ser = client.db.prepare('SELECT * FROM statystyki WHERE guild_id = ?').get(channel.guild.id);

    if (ser) {

        if (channel.id === ser?.data_id) return client.db.prepare('UPDATE statystyki SET data_id = ? WHERE guild_id = ?').run(null, channel.guild.id)
 
        if (channel.id === ser?.bots_id) return client.db.prepare('UPDATE statystyki SET bots_id = ? WHERE guild_id = ?').run(null, channel.guild.id)

        if (channel.id === ser?.members_id) return client.db.prepare('UPDATE statystyki SET members_id = ? WHERE guild_id = ?').run(null, channel.guild.id)

        if (channel.id === ser?.bans_id) return client.db.prepare('UPDATE statystyki SET bans_id = ? WHERE guild_id = ?').run(null, channel.guild.id)

        if (channel.id === ser?.nowy_id) return client.db.prepare('UPDATE statystyki SET nowy_id = ? WHERE guild_id = ?').run(null, channel.guild.id)

        if (channel.id === ser?.channel_id) return client.db.prepare('UPDATE statystyki SET channel_id = ? WHERE guild_id = ?').run(null, channel.guild.id)

        if (channel.id === ser?.member_add_id) return client.db.prepare('UPDATE statystyki SET member_add_id = ? WHERE guild_id = ?').run(null, channel.guild.id)

        if (channel.id === ser?.role_id) return client.db.prepare('UPDATE statystyki SET role_id = ? WHERE guild_id = ?').run(null, channel.guild.id)

        if (channel.id === ser?.role_user_id) return client.db.prepare('UPDATE statystyki SET role_user_id = ? WHERE guild_id = ?').run(null, channel.guild.id)

    }

    const suggest = client.db.prepare("SELECT channel_suggest FROM suggestions WHERE guild_id = ?").get(channel.guild.id);

    if (suggest != null && channel.id === suggest)  return client.db.prepare('UPDATE suggestions SET channel_suggest = ? WHERE guild_id = ?').run(null, channel.guild.id)

    const baza = client.db.prepare("SELECT * FROM serwer WHERE guild_id = ?").get(channel.guild.id);

    if (baza != null) {
        
        if (baza?.channel_logs != null && channel.id === baza?.channel_logs) return client.db.prepare('UPDATE serwer SET channel_logs = ? WHERE guild_id = ?').run(null, channel.guild.id)
    
        if (baza?.channel_modlog != null && channel.id === baza?.channel_modlog) return client.db.prepare('UPDATE serwer SET channel_modlog = ? WHERE guild_id = ?').run(null, channel.guild.id)

        if (baza?.channel_mems != null && channel.id === baza?.channel_mems) return client.db.prepare('UPDATE serwer SET channel_mems = ? WHERE guild_id = ?').run(null, channel.guild.id)
    
    }

    const wer = client.db.prepare("SELECT channel_id FROM wer WHERE guild_id = ?").get(channel.guild.id);

    if (wer != null && wer?.channel_id != null && channel.id === wer?.channel_id) {
        
        client.db.prepare('UPDATE wer SET channel_id = ? WHERE guild_id = ?').run(null, channel.guild.id)
        
        return client.db.prepare('UPDATE wer SET message_id = ? WHERE guild_id = ?').run(null, channel.guild.id)

    } 


    // if (channel.guild.me.permissions.has("VIEW_AUDIT_LOG")) {
    //     const baza = client.db.prepare('SELECT channel_logs FROM serwer WHERE guild_id = ?').get(channel.guild.id)
    //     if (baza && baza.channel_logs) {
    //         if (channel.guild.channels.cache.get(baza.channel_logs)) {
    //         const mlog = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE'}).then(audit => audit.entries.first());

    //         const infokanal = {
    //             GUILD_TEXT : `\`📰\` Kanał Tekstowy`,
    //             GUILD_VOICE : `\`🔊\` Kanał Głosowy`,
    //             GUILD_NEWS : `\`📢\` Kanał Ogłoszeniowy`,
    //             GUILD_STAGE_VOICE : `\`🎤\` Kanał Sceniczny`
    //         }

	//         const logs = new MessageEmbed()
    //             .setColor("2f3136")
	//             .setAuthor({name: `🚫 Usunięty kanał`})
    //             .addField(`\`🙍‍♂️\` Usunoł:`, `> <@${mlog.executor.id}> \`${mlog.executor.id}\``)
    //             .addFields(  
    //                 { name : `\`📚\` Nazwa kanału:`, value: `> ${channel.name}`, inline: true },
    //                 { name : `\`🛑\` Typ kanału:`, value: `> ${infokanal[channel.type]}`, inline: true},
    //             )
    //             .setTimestamp()
    //             .setFooter({text: `${client.user.tag} | (${client.user.id})`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
    //         return client.channels.cache.get(baza.channel_logs).send({embeds: [logs]})
    //     }else {
    //         return client.db.prepare('UPDATE serwer SET channel_logs = ? WHERE guild_id = ?').run(null, message.guild.id)
    //     }
    //     }

    // }
       



    } catch(err) {
        console.log(err)
        embed = new MessageEmbed()
            .setColor('#ff3042')
            .setTitle(`Błąd w event usuanie kanału`)
            .setDescription(`\`\`\`js\n${err}\n\`\`\``)
        return client.channels.cache.get(client.config.error).send({ephemeral: true, embeds: [embed]});
    }
}