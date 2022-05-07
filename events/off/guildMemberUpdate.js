const { MessageEmbed } = require('discord.js');

exports.run = async(client, member, oldNickname, newNickname) => {
try{
    if (!member.guild.me.permissions.has("VIEW_AUDIT_LOG" && "MANAGE_WEBHOOKS")) return;
    const baza = client.db.prepare('SELECT channel_logs FROM serwer WHERE guild_id = ?').get(member.guild.id)
    if(!baza) return;

    if(!baza.channel_logs) return;

    else{
        const mlog = await member.guild.fetchAuditLogs().then(audit => audit.entries.first());

        const kanal = baza.channel_logs

	        const logs = new MessageEmbed()
                .setColor("2f3136")
	            .setAuthor(`➰ Edytowany nick`)
	            .setDescription(`
                    \`👮‍♂️\` **Edytował:** ${mlog.executor} \`${mlog.executor.id}\`
                    \`🙍‍♂️\` **Użytkownik** ${member.user.username} \`${member.user.id}\`
                    \`📚\` **Stary nick:** ${oldNickname}
                    \`🔰\` **Nowy nick:** ${newNickname}`)
                .setTimestamp()
                .setFooter(`${client.user.tag} | (${client.user.id})`, client.user.displayAvatarURL({ dynamic: true }));
            client.channels.cache.get(kanal).createWebhook(`${member.name}`,{
                avatar: member.user.displayAvatarURL({ dynamic: true })
            }).then(wehbook => {
                wehbook.send({embeds: [logs]}).then(() => {
                    wehbook.delete()
                })
        })
    }
    }catch(err){
        console.log(err)
        embed = new MessageEmbed()
            .setColor('#ff3042')
            .setTitle(`Błąd w event Edytowany nick`)
            .setDescription(`\`\`\`js\n${err}\n\`\`\``)
        return client.channels.cache.get(client.config.error).send({ephemeral: true, embeds: [embed]});
    }
}