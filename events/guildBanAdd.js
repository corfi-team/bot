const { MessageEmbed } = require('discord.js');

exports.run = async (client, ban) => {
try{
    if (!ban.guild.me.permissions.has("VIEW_AUDIT_LOG" && "MANAGE_WEBHOOKS")) return
    const baza = client.db.prepare('SELECT channel_modlog FROM serwer WHERE guild_id = ?').get(ban.guild.id)
    const ser = client.db.prepare('SELECT * FROM statystyki WHERE guild_id = ?').get(ban.guild.id)

    if (ser) {
        if (ser?.bans_id && ser?.bans_id != null) {
            let i = client.db.prepare(`SELECT bans_ilosc FROM statystyki WHERE guild_id = ?`).get(ban.guild.id);
            if(i){
                client.db.prepare('UPDATE statystyki SET bans_ilosc = ? WHERE guild_id = ?').run(i.bans_ilosc + 1 , ban.guild.id);
            }else{
                client.db.prepare(`INSERT INTO statystyki(guild_id, bans_ilosc) VALUES(?,?)`).run(ban.guild.id, "1");
            }
        }
    }

    if(baza && baza.channel_modlog) {
        const mlog = await ban.guild.fetchAuditLogs().then(audit => audit.entries.first());

        const kanal = baza.channel_modlog

	    const logs = new MessageEmbed()
            .setColor("2f3136")
	        .setAuthor({name :`🛑 Ban`})
	        .setDescription(`
                \`🙍‍♂️\` **Moderator:** ${mlog.executor} \`${mlog.executor.id}\`
                \`📚\` **Dostał:** ${ban.user} \`${ban.user.id}\``)
            .setTimestamp()
            .setFooter({ text :`${client.user.tag} | (${client.user.id})`, iconURL: client.user.displayAvatarURL({ dynamic: true })});
        client.channels.cache.get(kanal).createWebhook(`${ban.user.username}`,{
            avatar: ban.user.displayAvatarURL({ dynamic: true })
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