const { MessageEmbed } = require('discord.js');

exports.run = async (client, ban) => {
try{
    if (!ban.guild.me.permissions.has("VIEW_AUDIT_LOG" && "MANAGE_WEBHOOKS")) return
    const baza = client.db.prepare('SELECT channel_modlog FROM serwer WHERE guild_id = ?').get(ban.guild.id)
    const ser = client.db.prepare('SELECT * FROM statystyki WHERE guild_id = ?').get(ban.guild.id)

    if (ser) {
        if (ser?.member_add_id && ser?.member_add_id != null) {
            let i = client.db.prepare(`SELECT bans_ilosc FROM statystyki WHERE guild_id = ?`).get(ban.guild.id);
            if(i){
                client.db.prepare('UPDATE statystyki SET bans_ilosc = ? WHERE guild_id = ?').run(i.member_add_ilosc - 1, ban.guild.id);
            }else{
                client.db.prepare(`INSERT INTO statystyki(guild_id, bans_ilosc) VALUES(?,?)`).run(ban.guild.id, "-1");
            }
        }
    }

    if(!baza) return;
    if(!baza.channel_modlog) return;

    else {
        const mlog = await ban.guild.fetchAuditLogs({type: "MEMBER_BAN_REMOVE"}).then(audit => audit.entries.first());

        const kanal = baza.channel_modlog

	        const logs = new MessageEmbed()
                .setColor("2f3136")
	            .setAuthor({name: `๐งช UnBan`})
	            .setDescription(`
                    \`๐โโ๏ธ\` **Moderator:** ${mlog.executor} \`${mlog.executor.id}\`
                    \`๐\` **Dostaล:** ${ban.user} \`${ban.user.id}\``)
                .setTimestamp()
                .setFooter({text: `${client.user.tag} | (${client.user.id})`, iconURL: client.user.displayAvatarURL({ dynamic: true })});

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
            .setTitle(`Bลฤd w event Tworzenie kanaล`)
            .setDescription(`\`\`\`js\n${err}\n\`\`\``)
        return client.channels.cache.get(client.config.error).send({ephemeral: true, embeds: [embed]});
    }
}