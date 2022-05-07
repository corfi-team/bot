const { MessageActionRow, MessageButton, MessageEmbed, Collector , MessageComponentInteraction } = require('discord.js')
const moment = require('moment-timezone')
const emotki = require ("../../base/emotki.json")


module.exports = {
    name : 'gdev',
    aliases: ['gdev1', 'gban', 'gunban'],
    category : 'developerskie',
    description : 'Zarządzanie globalbanem',
    run : async(client, message, args) => {

        if (!client.config.devs.includes(message.author.id)) return

            const reason = args.slice(1).join(" ") || 'Brak powodu.'

            if (!args.length) {
                const id = new MessageEmbed()
                    .setColor('#ff3042')
                    .setTitle(`Odmowa dostepu`)
                    .setDescription(`> Podaj ID serwera lub użytkownika`)
                return message.reply({ allowedMentions: { repliedUser: false }, ephemeral: true, embeds: [id]});
            }
            else if (isNaN(args[0]) || args[0].length != 18) {
                const id = new MessageEmbed()
                    .setColor('#ff3042')
                    .setTitle(`Odmowa dostepu`)
                    .setDescription(`> Podaj ID serwera lub użytkownika`)
                return message.reply({ allowedMentions: { repliedUser: false }, ephemeral: true, embeds: [id]});
            }
            else {
                const bloczek = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId(`gban`)
                            .setLabel(`🔨 GBan`)
                            .setStyle(`DANGER`)
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId(`gunban`)
                            .setLabel(`🔰 GUnBan`)
                            .setStyle(`SUCCESS`)
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId(`checkban`)
                            .setLabel(`📜 Checkban`)
                            .setStyle(`PRIMARY`)
                    )
                const error = new MessageEmbed()
                    .setColor('#ff3042')
                    .setDescription(`> Wybierz odpowiedni Block`)
                message.reply({ allowedMentions: { repliedUser: false }, ephemeral: true, embeds: [error], components: [bloczek]});
                const f1 = i =>  i.user.id === message.author.id
                const collector = message.channel.createMessageComponentCollector({ f1, time: 15 * 1000 })
                    collector.on('collect', async (i) => {
                        if (i.customId === 'gban') {
                        const base = client.db.prepare('SELECT * FROM gbans WHERE id = ?').get(args[0])
                        if (base){
                            let gban = new MessageEmbed()
                                .setColor('#ff3042')
                                .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({dynamic: true})}`)
                                .setDescription(`> ${emotki.tak} **To ID ma Gbana**`);
                            return message.channel.send({ ephemeral: true, embeds: [gban]});
                        }
                        else{
                            client.db.prepare('INSERT INTO gbans (id, date, admin, powod) VALUES (?, ?, ?, ?)').run(args[0], moment().tz('Poland').format('DD.MM.YYYY, HH:mm'), message.author.tag, args.slice(1).join(" "))
                            let gban = new MessageEmbed()
                                .setColor('#0099ff')
                                .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({dynamic: true})}`)
                                .setDescription(`> ${emotki.tak} **Nadałeś Gbana**`);
                            message.channel.send({ ephemeral: true, embeds: [gban]});
                            embed = new MessageEmbed()
                                .setColor('#ff3042')
                                .setDescription(`>>> ${emotki.ban} **GlobalBan**\n\n${emotki.user} **\`Dostał:\`** <@${args[0]}>\n${emotki.klucz} **\`Od:\`** \`${message.author.tag}\`\n${emotki.edit} **\`Za:\`** \`${reason}\``)
                            return client.channels.cache.get(client.config.gbans_channel).send({ephemeral: true, embeds: [embed]});
                        }
                    }
                    else if (i.customId === 'gunban') {
                        const base = client.db.prepare('SELECT * FROM gbans WHERE id = ?').get(args[0])
                        if (!base){
                            let gban = new MessageEmbed()
                                .setColor('#0099ff')
                                .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({dynamic: true})}`)
                                .setDescription(`> ${emotki.not} **To ID nie ma Gbana**`);
                            return message.channel.send({ ephemeral: true, embeds: [gban]});
                        }
                        else{
                            client.db.prepare('DELETE FROM gbans WHERE id = ?').run(args[0])
                            let GlobalBan = new MessageEmbed()
                                .setColor('#0099ff')
                                .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({dynamic: true})}`)
                                .setDescription(`> ${emotki.tak} **Nadałeś GUnBan**`);
                            message.channel.send({ ephemeral: true, embeds: [GlobalBan]});
                            embed = new MessageEmbed()
                                .setColor('#0099ff')
                                .setDescription(`>>> ${emotki.ban} **UnGBana**\n\n${emotki.user} **\`Dostał:\`** <@${args[0]}>\n${emotki.klucz} **\`Od:\`** \`${message.author.tag}\``)
                            return client.channels.cache.get(client.config.gbans_channel).send({ephemeral: true, embeds: [embed]});
                        }
                    }
                    if (i.customId === 'checkban') {
                        const base = client.db.prepare('SELECT * FROM gbans WHERE id = ?').get(args[0])

                        if (!base){
                            let gban = new MessageEmbed()
                                .setColor('#0099ff')
                                .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({dynamic: true})}`)
                                .setDescription(`> ${emotki.not} **To ID nie ma Gbana**`);
                            return message.channel.send({ ephemeral: true, embeds: [gban]});
                        } //   client.db.prepare('CREATE TABLE IF NOT EXISTS gbans (id TEXT, date TEXT, admin TEXT, powod TEXT)').run();
                        else{
                            const baze = client.db.prepare('SELECT * FROM gbans WHERE id = ?').get(args[0])
                            const id =  baze?.id || ``
                            const kiedy = baze?.date ||``
                            const od = baze?.admin ||``
                            const za = baze?.powod || `Brak`

                            let gban = new MessageEmbed()
                            .setColor('#0099ff')
                            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({dynamic: true})}`)
                            .setDescription(`>>> Dosiada gbana: <@${id}> \`${id}\` \nDostał/a go: \`${kiedy}\`\nOd: **${od}**\nZa: \n\`\`\`diff\n- ${za}\n\`\`\``);
                        return message.channel.send({ ephemeral: true, embeds: [gban]});
                        }
                    }
                })
            }
    }
}