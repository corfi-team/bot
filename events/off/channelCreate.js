const { MessageEmbed } = require('discord.js');

exports.run = async (client, channel) => {
try{
    if (!channel.guild.me.permissions.has("VIEW_AUDIT_LOG" && "MANAGE_WEBHOOKS")) return;
    const baza = client.db.prepare('SELECT channel_logs FROM serwer WHERE guild_id = ?').get(channel.guild.id)
    if(!baza) return;
    if(!baza.channel_logs) return;

    else{
        const mlog = await channel.guild.fetchAuditLogs({type: 'CHANNEL_CREATE'}).then(audit => audit.entries.first());

        const infokanal = {
            GUILD_TEXT : `\`📰\` Kanał Tekstowy`,
            GUILD_VOICE : `\`🔊\` Kanał Głosowy`,
            GUILD_NEWS : `\`📢\` Kanał Ogłoszeniowy`,
            GUILD_STAGE_VOICE : `\`🎤\` Kanał Sceniczny`
        }

        const kanal = baza.channel_logs

	        const logs = new MessageEmbed()
                .setColor("2f3136")
	            .setAuthor(`✅ Storzony kanał`)
	            .setDescription(`
                    \`🙍‍♂️\` **Stworzył:** <@${mlog.executor.id}> \`${mlog.executor.id}\`
                    \`📚\` **Nazwa kanał:** <#${channel.id}> \`${channel.name}\`
                    \n\`🛑\` **Typ kanału: ${infokanal[channel.type]}**`)
                .setTimestamp()
                .setFooter(`${client.user.tag} | (${client.user.id})`, client.user.displayAvatarURL({ dynamic: true }));

            client.channels.cache.get(kanal).createWebhook(`${channel.name}`,{
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
            .setTitle(`Błąd w event Tworzenie kanał`)
            .setDescription(`\`\`\`js\n${err}\n\`\`\``)
        return client.channels.cache.get(client.config.error).send({ephemeral: true, embeds: [embed]});
    }
}