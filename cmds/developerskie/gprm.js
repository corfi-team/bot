const { MessageActionRow, MessageButton, MessageEmbed, Collector , MessageComponentInteraction } = require('discord.js')
const moment = require('moment-timezone')
const emotki = require ("../../base/emotki.json")

module.exports = {
    name : 'gprm',
    aliases: ['gprm1'],
    category : 'developerskie',
    description : 'Zarządzanie premium',
    run : async(client, message, args) => {

        if (!client.config.devs.includes(message.author.id)) {
            return;
        }
            else if (!args.length){
                const id = new MessageEmbed()
                    .setColor('#ff3042')
                    .setTitle(`Odmowa dostepu`)
                    .setDescription(`> Podaj ID serwera lub użytkownika`)
                return message.reply({ allowedMentions: { repliedUser: false }, ephemeral: true, embeds: [id]});
            }
            if (isNaN(args[0]) || args[0].length != 18){
                const id = new MessageEmbed()
                    .setColor('#ff3042')
                    .setTitle(`Odmowa dostepu`)
                    .setDescription(`> Podaj ID serwera lub użytkownika`)
                return message.reply({ allowedMentions: { repliedUser: false }, ephemeral: true, embeds: [id]});
            }

            else {
                const premium = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId(`nadaj`)
                            .setLabel(`✅ Nadaj`)
                            .setStyle(`SUCCESS`)
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId(`wez`)
                            .setLabel(`⛔ Weź`)
                            .setStyle(`DANGER`)
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId(`checkprm`)
                            .setLabel(`🎈 CheckPremium`)
                            .setStyle(`PRIMARY`)
                    )
                const nadaj = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId(`user`)
                            .setLabel(`🙍‍♂️ Użytkownik`)
                            .setStyle(`SUCCESS`)
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId(`serwer`)
                            .setLabel(`🏠 Serwer`)
                            .setStyle(`DANGER`)
                    )

                const error = new MessageEmbed()
                    .setColor('#0099ff')
                    .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({dynamic: true})}`)
                    .setDescription(`> Wybierz odpowiedni Block`)
                message.reply({ allowedMentions: { repliedUser: false }, ephemeral: true, embeds: [error], components: [premium]});
                const f1 = i =>  i.user.id === message.author.id
                const collector = message.channel.createMessageComponentCollector({ f1, time: 50 * 1000 })
                collector.on('collect', async (i) => {
                    if (i.customId === 'nadaj') {
                        const prm = new MessageEmbed()
                            .setColor('#0099ff')
                            .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({dynamic: true})}`)
                            .setDescription(`> ${emotki.tak} **Wybierz komu mam dać premium!**`);
                        return message.channel.send({ ephemeral: true, embeds: [prm], components: [nadaj]});
                    }
                    else if (i.customId === 'wez') {
                        const base = client.db.prepare('SELECT * FROM premium WHERE id = ?').run(args[0])
                        if (!base){
                            client.db.prepare('DELETE FROM premium WHERE id = ?').run(args[0])
                            const prm = new MessageEmbed()
                                .setColor('#ff3042')
                                .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({dynamic: true})}`)
                                .setDescription(`> ${emotki.tak} **Premium zabrane!**`);
                            return message.channel.send({ ephemeral: true, embeds: [prm]});
                        }else {
                            const prm = new MessageEmbed()
                                .setColor('#0099ff')
                                .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({dynamic: true})}`)
                                .setDescription(`> ${emotki.not} **To ID nie ma Premium**`);
                            return message.channel.send({ ephemeral: true, embeds: [prm]});
                        }
                    }else if (i.customId === 'checkprm') {
                        const base = client.db.prepare('SELECT * FROM premium WHERE id = ?').run(args[0])
                        if (!base){
                            const prm = new MessageEmbed()
                                .setColor('#ff3042')
                                .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({dynamic: true})}`)
                                .setDescription(`> ${emotki.tak} **To ID ma Premium!**`);
                            return message.channel.send({ ephemeral: true, embeds: [prm]});
                        }else {
                            const prm = new MessageEmbed()
                                .setColor('#0099ff')
                                .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({dynamic: true})}`)
                                .setDescription(`> ${emotki.not} **To ID nie ma Premium**`);
                            return message.channel.send({ ephemeral: true, embeds: [prm]});
                        }
                    }
                    if (i.customId === 'user') {
                        const base = client.db.prepare('SELECT * FROM premium WHERE id = ?').get(args[0])
                        if (base){
                            const gban = new MessageEmbed()
                                .setColor('#0099ff')
                                .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({dynamic: true})}`)
                                .setDescription(`> ${emotki.tak} **To ID ma Premium**`);
                            return message.channel.send({ ephemeral: true, embeds: [gban]});
                        }else{
                            client.db.prepare('INSERT INTO premium (id, type) VALUES (?, ?)').run(args[0], 'osoba')
                            const prm = new MessageEmbed()
                                .setColor('#0099ff')
                                .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({dynamic: true})}`)
                                .setDescription(`> ${emotki.tak} **Nadałem premium!**`);
                            return message.channel.send({ ephemeral: true, embeds: [prm]});
                        }
                    }
                    else if (i.customId === 'serwer') {
                        const base = client.db.prepare('SELECT * FROM premium WHERE id = ?').get(args[0])
                        if (base){
                            let gban = new MessageEmbed()
                                .setColor('#0099ff')
                                .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({dynamic: true})}`)
                                .setDescription(`> ${emotki.tak} **To ID ma Premium**`);
                            return message.channel.send({ ephemeral: true, embeds: [gban]});
                        }else{
                            client.db.prepare('INSERT INTO premium (id, type) VALUES (?, ?)').run(args[0], 'serwer')
                            const prm = new MessageEmbed()
                                .setColor('#0099ff')
                                .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({dynamic: true})}`)
                                .setDescription(`> ${emotki.tak} **Nadałem premium!**`);
                            return message.channel.send({ ephemeral: true, embeds: [prm]});
                        }
                    }
                }
            )
        }
    }
}