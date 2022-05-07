const { MessageEmbed } = require('discord.js');

exports.run = async(client, oldChannel, newChannel) => {
try{
    if (!oldChannel.guild.me.permissions.has("VIEW_AUDIT_LOG" && "MANAGE_WEBHOOKS")) return;
    const baza = client.db.prepare('SELECT channel_logs FROM serwer WHERE guild_id = ?').get(oldChannel.guild.id)
    if(!baza) return;

    if(!baza.channel_logs) return;

    else{
        const mlog = await oldChannel.guild.fetchAuditLogs({type : "CHANNEL_UPDATE"}).then(audit => audit.entries.first());

        const kanal = baza.channel_logs

        const infokanal ={
            GUILD_TEXT : `\`📰\` Kanał Tekstowy`,
            GUILD_VOICE : `\`🔊\` Kanał Głosowy`,
            GUILD_NEWS : `\`📢\` Kanał Ogłoszeniowy`,
            GUILD_STAGE_VOICE : `\`🎤\` Kanał Sceniczny`
        }

	        const logs = new MessageEmbed()
                .setColor("2f3136")
	            .setAuthor(`➰ Edytowany kanał`)
	            .setDescription(`
                    \`🙍‍♂️\` **Edytował:** <@${mlog.executor.id}> \`${mlog.executor.id}\`
                    \`📚\` **Stara nazwa kanału:** ${oldChannel.name}
                    \`🔰\` **Nowa nazwa kanału:** ${newChannel.name}
                    \n \`🧶\` **Typ kanału: ${infokanal[newChannel.type]}** <#${newChannel.id}> ${newChannel.id}`)
                .setTimestamp()
                .setFooter(`${client.user.tag} | (${client.user.id})`, client.user.displayAvatarURL({ dynamic: true }));
            client.channels.cache.get(kanal).createWebhook(`${newChannel.name}`,{
                avatar: client.user.displayAvatarURL({ dynamic: true })
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
            .setTitle(`Błąd w event Edytowany kanał`)
            .setDescription(`\`\`\`js\n${err}\n\`\`\``)
        return client.channels.cache.get(client.config.error).send({ephemeral: true, embeds: [embed]});
    }
}