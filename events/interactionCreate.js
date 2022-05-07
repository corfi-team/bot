const { MessageEmbed, WebhookClient, MessageActionRow, MessageButton } = require('discord.js');
const { readdirSync } = require('fs')
const wait = require('util').promisify(setTimeout);
const moment = require('moment-timezone')

exports.run = async (client, i) => {

    if(i.isSelectMenu()){
        if (i.customId === 'help') {
            const { typek } = require('../cmds/informacyjne/help')

            if(i.user.id !== typek) return
            const pliki = readdirSync((`./cmds/${i.values[0]}/`)).filter(file => file.endsWith(".js"));

            const cmdmap = pliki.map(files => `${files}`).join(', ')
            const embed = new MessageEmbed()
                .setColor(client.config.color)
                .setAuthor({name: `${client.user.username} - Lista Komend`,  iconURL: client.user.displayAvatarURL()})
                .addField(`Komendy`, `\`\`\`diff\n+ ${cmdmap.replace(/\.js/gi, ``)}\`\`\``)
                .setThumbnail(client.user.displayAvatarURL())
            i.update({ embeds: [embed] })
        }
    }
    if(i.isButton()){
        if (i.customId === 'weryf') {
            const baza = client.db.prepare('SELECT * FROM wer WHERE guild_id = ?').get(i.guild.id)
            if (baza?.weryfikacja != null || baza?.weryfikacja === 'off') {
                const embed = new MessageEmbed()
                    .setColor(client.config.color)
                    .setAuthor({name: `${i.user.username}`,  iconURL: i.user.displayAvatarURL()})
                    .addField(`Mamy problem!`, `\`\`\`diff\n- Wychodzi na to, że weryfikacja na tym serwerze jest wyłączona!\`\`\``)
                    .setThumbnail(i.user.displayAvatarURL())
                return i.reply({ embeds: [embed], ephemeral: true})
            }

            else if (baza && baza?.weryfikacja != null) {

                const role = baza.roles_id

                if (!role) return client.db.prepare(`UPDATE wer SET roles_id = ? WHERE guild_id = ?`).run(null, i.guild.id)

                const data = role.split(';')
                let addrole = ''
                data.forEach(c => {
                    if (!i.guild.roles.cache.get(c) && !i.manageable) return
                    if (i.member.roles.cache.some(r => r.id === c)) return
                    let rolaa = i.guild.roles.cache.get(c)
                    i.guild.members.cache.get(i.user.id).roles.add(rolaa)  
                    addrole += `<@&${c}>, `
                }) 

                const embed = new MessageEmbed()
                    .setColor(client.config.color)
                    .setAuthor({name: `${i.user.username}`,  iconURL: i.user.displayAvatarURL()})
                    .addField(`Weryfikacja ukończona`, `\`\`\`diff\n+ Otrzymujesz rolę za pomyślne przejście weryfikacji! \`\`\`\n >>> **Role:** ${addrole || "Brak"}`)
                    .setThumbnail(i.user.displayAvatarURL())
                i.reply({ embeds: [embed], ephemeral: true})
                if (baza?.channel_log_id && baza?.channel_log_id != null) {
                    const embed = new MessageEmbed()
                        .setColor(client.config.color)
                        .setAuthor({name: `✅ Ukończył weryfikacje:`})
                        .addField(`\`👥\` Użytkownik:`, `\`\`\`diff\n+ ${i.user.tag} (${i.user.id}) \`\`\``, true)
                        .addField(`\`⏰\` Data:`, `\`\`\`diff\n+ ${moment().tz('Poland').format('DD.MM.YYYY, HH:mm')}\`\`\``, true)
                        .setThumbnail(i.user.displayAvatarURL())
                    return i.guild.channels.cache.get(baza.channel_log_id).send({ embeds: [embed], ephemeral: true})
                }
            }
        }
        if (i.customId === 'ticket_on') {
            ticket_create = await i.guild.channels.create(`💚・Ticket: ${i.user.tag}`, {
                type: "GUILD_TEXT",
                topic: "Test Corfi to najlepszy bot!",
                parent: "949563091702669342",
                
                permissionOverwrites : [
                    {
                        id: i.user.id,
                        allow: [ "SEND_MESSAGES", "VIEW_CHANNEL"],
                    }, 
                    {
                        id: i.guild.roles.everyone,
                        deny : ["SEND_MESSAGES", "VIEW_CHANNEL"]
                    }
                ]

            })

            i.reply({ ephemeral: true, content: `Stworzony tiket!`})

            const ticket_buton = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`Ticket_Delete`)
                        .setLabel(`💢 Close`)
                        .setStyle(`DANGER`)
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId(`Ticket_Save`)
                        .setLabel(`👀 Save`)
                        .setStyle(`SUCCESS`)
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId(`Ticket_VC`)
                        .setLabel(`🔊 Channel VC`)
                        .setStyle(`PRIMARY`)
                )

            const embed = new MessageEmbed()
                .setColor("2f3136")
                .setThumbnail(i.user.avatarURL({size: 1024, dynamic: true}))
                .setDescription(`Tiket :D`)
                .setFooter({text: `${client.user.tag} | (${client.user.id})`, iconURL: client.user.displayAvatarURL({ dynamic: true })})
            ticket_create.send({content: `${i.user}`}).then(d => {
                d.delete(1000)
            })
            ticket_create.send({embeds: [embed], components: [ticket_buton]})

        }
    }

    if (!i.isCommand()){
        return
    } else {
        const command = client.slashesCommands.get(i.commandName);
        if (!command) return;
        try {
            await command.execute(i, client);
        } catch (error) {
            return console.error(error);
        }
    }
}