const { MessageEmbed } = require('discord.js');

exports.run = (client, oldRole, newRole) => {
try{
    if (!newRole.guild.me.permissions.has("VIEW_AUDIT_LOG" && "MANAGE_WEBHOOKS")) return;
    const baza = client.db.prepare('SELECT channel_logs FROM serwer WHERE guild_id = ?').get(oldRole.guild.id)
    if(!baza) return;

    if(!baza.channel_logs) return;

    else{

        const kanal = baza.channel_logs

	        const logs = new MessageEmbed()
                .setColor(`${newRole.hexColor || `2f3136`}`)
	            .setAuthor(`🧩 Edytowana rola`)
	            .setDescription(`
                    \`🔥\` **Stara nazwa:** ${oldRole.name} 
                    \`🧸\` **Edytowana nazwa:** ${newRole.name}
                    \`🛑\` **Ważne:

                    \n\`🔋\`Stary kolor: ${oldRole.hexColor}
                    \`📺\`Nowy kolor: ${newRole.hexColor || "Brak"}
                    \`🧵\`Stara emotka: ${oldRole.unicodeEmoji || "Brak"}
                    \`👔\`Nowa emotka: ${newRole.unicodeEmoji || "Brak"} **`)
                .setTimestamp()
                .setFooter(`${client.user.tag} | (${client.user.id})`, client.user.displayAvatarURL({ dynamic: true }));

            client.channels.cache.get(kanal).createWebhook(`${newRole.name}`,{
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
            .setTitle(`Błąd w event Edytowana rola`)
            .setDescription(`\`\`\`js\n${err}\n\`\`\``)
        return client.channels.cache.get(client.config.error).send({ephemeral: true, embeds: [embed]});
    }
}