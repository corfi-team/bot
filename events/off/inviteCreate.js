const { MessageEmbed, Client} = require('discord.js');

exports.run = async (client, invite) => {
// try{
    console.log(`1`)
    // if (!message.guild.me.permissions.has("VIEW_AUDIT_LOG" && "MANAGE_WEBHOOKS")) return;
    // const baza = client.db.prepare('SELECT channel_logs FROM serwer WHERE guild_id = ?').get(message.guild.id)
    // if(!baza) return;
    // if(!baza.channel_logs) return;
    // else{
    //     const mlog = await channel.guild.fetchAuditLogs({type: 'INVITE_CREATE'}).then(audit => audit.entries.first());
    //     const kanal = baza.channel_logs

	//         const logs = new MessageEmbed()
    //             .setColor("2f3136")
	//             .setAuthor(`✅ Storzony link`)
	//             .setDescription(`
    //                 \`🙍‍♂️\` **Stworzył:** <@${mlog.executor.id}> \`${mlog.executor.id}\`
    //                 \`📚\` **Na kanale:** <#${message.channel.id}> \`${message.channel.name}\`
    //                 \`🖇\` **Link: ${message}**
    //                 \`\` **Iość użyć:** ${message.maxUses}
    //                 \`\` **Czas: ** ${message.maxAge}
    //                 Coś: ${message.memberCount}`)
    //             .setTimestamp()
    //             .setFooter(`${client.user.tag} | (${client.user.id})`, client.user.displayAvatarURL({ dynamic: true }));

    //         client.channels.cache.get(kanal).createWebhook(`${channel.name}`,{
    //             avatar: client.user.displayAvatarURL({ dynamic: true })
    //         }).then(wehbook => {
    //             wehbook.send({embeds: [logs]}).then(() => {
    //                 wehbook.delete()
    //             })
    //         })
    //     }
    // }catch(err){
    //     console.log(err)
    //     embed = new MessageEmbed()
    //         .setColor('#ff3042')
    //         .setTitle(`Błąd w event Tworzenie kanał`)
    //         .setDescription(`\`\`\`js\n${err}\n\`\`\``)
    //     return client.channels.cache.get(client.config.error).send({ephemeral: true, embeds: [embed]});
    // }
}