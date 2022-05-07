const { MessageEmbed} = require('discord.js');

exports.run = async (client, role, member) => {
try{
    if (!role.guild.me.permissions.has("VIEW_AUDIT_LOG" && "MANAGE_WEBHOOKS")) return;
    const baza = client.db.prepare('SELECT channel_logs FROM serwer WHERE guild_id = ?').get(role.guild.id)
    if(!baza) return;

    if(!baza.channel_logs) return;

    else{

        const mlog = await role.guild.fetchAuditLogs().then(audit => audit.entries.first());

        const kanal = baza.channel_logs

	        const logs = new MessageEmbed()
                .setColor(`2f3136`)
	            .setAuthor(`✅ Nadana rola`)
	            .setDescription(`
                    \`🔥\` **Nowa rola:** ${role.name} <@&${role.id}>
                    \`👮‍♂️\` **Nadał:** ${mlog.executor} \`${mlog.executor.id}\`
                    \`🙍‍♂️\` **Dostał** ${member.user.username} \`${member.user.id}\``)
                .setTimestamp()
                .setFooter(`${client.user.tag} | (${client.user.id})`, client.user.displayAvatarURL({ dynamic: true }));
            client.channels.cache.get(kanal).createWebhook(`${member.user.tag}`,{
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
            .setTitle(`Błąd w event Nadana rola`)
            .setDescription(`\`\`\`js\n${err}\n\`\`\``)
        return client.channels.cache.get(client.config.error).send({ephemeral: true, embeds: [embed]});
    }
}