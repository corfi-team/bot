const { MessageEmbed, WebhookClient } = require('discord.js');

exports.run = async (client, message, oldMessage) => {
try { 
    if (!message && !message.guild && !message.author && message.author.bot && message.webhookID && message.applicationId && !message.guild.me.permissions.has("MANAGE_WEBHOOKS")) return
    const baza = client.db.prepare('SELECT channel_logs FROM serwer WHERE guild_id = ?').get(message.guild.id)

    if (baza?.channel_logs != null) {
        if (message.guild.channels.cache.get(baza?.channel_logs)) {
            const serek = client.db.prepare('SELECT * FROM webhook WHERE guild_id = ?').get(message.guild.id)
            if (!serek) {
                return message.guild.channels.cache.get(baza.channel_logs).createWebhook(`Corfi logs`, {avatar: message.author.displayAvatarURL()}).then(w => {
                    const i = client.db.prepare('SELECT url FROM webhook WHERE guild_id = ?').get(message.guild.id);
                    if(i){
                        client.db.prepare(`UPDATE webhook SET url = ? WHERE guild_id = ?`).run(`https://ptb.discord.com/api/webhooks/${w.id}/${w.token}`, message.guild.id)
                    }else{
                        client.db.prepare(`INSERT INTO webhook(guild_id, url) VALUES(?,?)`).run(message.guild.id, `https://ptb.discord.com/api/webhooks/${w.id}/${w.token}`);
                    }
                })  
            }
            const webhooks = await message.guild.channels.cache.get(baza?.channel_logs).fetchWebhooks()
            const webhook = webhooks.filter(wh => wh.url === serek.url)
            if (!webhook) {
                return message.guild.channels.cache.get(baza.channel_logs).createWebhook(`Corfi logs`, {avatar: message.author.displayAvatarURL()}).then(w => {
                    const i = client.db.prepare('SELECT url FROM webhook WHERE guild_id = ?').get(message.guild.id);
                    if(i) {
                        client.db.prepare(`UPDATE webhook SET url = ? WHERE guild_id = ?`).run(`https://ptb.discord.com/api/webhooks/${w.id}/${w.token}`, message.guild.id)
                    } else {
                        client.db.prepare(`INSERT INTO webhook(guild_id, url) VALUES(?,?)`).run(message.guild.id, `https://ptb.discord.com/api/webhooks/${w.id}/${w.token}`);
                    }
                })
            } 
            else if (webhook) {
                const maselko = new WebhookClient({ url: serek.url})
                
                if (message.content) {
                    if (message.content > 1022) {
                        const logs = new MessageEmbed()
                        .setColor("2f3136")
                        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                        .setAuthor({name: `Edytowana wiadomość`})
                        .addField(`Użytkownik:`, `${message.author} \`${message.author.id}\``, true)
                        .addField(`Kanał:`, `${message.channel} \`${message.channel.id}\``, true)
                        .setFooter({text: `${client.user.tag} | (${client.user.id})`, iconURL: client.user.displayAvatarURL({ dynamic: true })})

                        await maselko.send({
                            username: message.author.tag,
                            avatarURL: message.author.avatarURL(),
                            embeds: [logs],
                        })
                        maselko.send({
                            username: message.author.tag,
                            avatarURL: message.author.avatarURL(),
                            content: `\`\`\`${message.content}\`\`\` \n \`\`\`${oldMessage.content}\`\`\``
                        })
                    }
                    else {
                        const logs = new MessageEmbed()
                        .setColor("2f3136")
                        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                        .setAuthor({name: `Edytowana wiadomość`})
                        .addField(`Użytkownik:`, `${message.author} \`${message.author.id}\``, true)
                        .addField(`Kanał:`, `${message.channel} \`${message.channel.id}\``, true)
                        .addField(`Stara wiadomość:`, message.content)
                        .addField(`Nowa wiadomość:`, oldMessage.content)
                        .setFooter({text: `${client.user.tag} | (${client.user.id})`, iconURL: client.user.displayAvatarURL({ dynamic: true })})

                        maselko.send({
                            username: message.author.tag,
                            avatarURL: message.author.avatarURL(),
                            embeds: [logs],
                        })
                    }
                }

                if (message.embeds && message.channel.id != baza?.channel_logs && client.user.id != message.author.id) {
                    const logs = new MessageEmbed()
                        .setColor("2f3136")
                        .setAuthor({name: `Edytowany embed`})
                        .addField(`Użytkownik:`, `${message.author} \`${message.author.id}\``, true)
                        .addField(`Kanał:`, `${message.channel} \`${message.channel.id}\``, true)
                        .setFooter({text: `${client.user.tag} | (${client.user.id})`, iconURL: client.user.displayAvatarURL({ dynamic: true })})

                        message.embeds.forEach(e => {
                            const o = new MessageEmbed()
                            if (e?.color != null) o.setColor(e?.color)
                            if (e?.description != null) o.setDescription(e?.description)
                            if (e?.title != null) o.setTitle(e?.title)
                            if (e?.url != null) o.setURL(e?.url)
                            if (e?.timestamp != null) o.setTimestamp(e?.timestamp)
                            if (e?.author != null) o.setAuthor(e?.author)
                            if (e?.image != null) o.setImage(e?.image.url)
                            if (e?.footer != null) o.setFooter(e?.footer)
                            if (e?.fields != null) o.addFields(e?.fields)

                            maselko.send({
                                username: message.author.tag,
                                avatarURL: message.author.avatarURL(),
                                embeds: [logs, o],
                            })
                            
                        })
                    
                        oldMessage.embeds.forEach(e => {
                            const i = new MessageEmbed()
                            if (e?.color != null) i.setColor(e?.color)
                            if (e?.description != null) i.setDescription(e?.description)
                            if (e?.title != null) i.setTitle(e?.title)
                            if (e?.url != null) i.setURL(e?.url)
                            if (e?.timestamp != null) i.setTimestamp(e?.timestamp)
                            if (e?.author != null) i.setAuthor(e?.author)
                            if (e?.image != null) i.setImage(e?.image.url)
                            if (e?.footer != null) i.setFooter(e?.footer)
                            if (e?.fields != null) i.addFields(e?.fields)
                    
                       maselko.send({
                            username: message.author.tag,
                            avatarURL: message.author.avatarURL(),
                            embeds: [i],
                        })                    
                    })
                }
            }
        }
    }

    } catch(err) {
        console.log(err)
        embed = new MessageEmbed()
            .setColor('#ff3042')
            .setTitle(`Błąd w event Edytowana wiadomość`)
            .setDescription(`\`\`\`js\n${err}\n\`\`\``)
        return client.channels.cache.get(client.config.error).send({ephemeral: true, embeds: [embed]});
    }
}
    