const { Discord, MessageActionRow, MessageSelectMenu, MessageEmbed } = require("discord.js");
const emotki = require ('../../base/emotki.json')

module.exports = {
    name : 'unban',
    aliases: ['ub'],
    category : 'moderacyjne',
    description : 'Odbanowuje uzytkownika',
    run : async(client, message, args) => {

            if (!message.guild.me.permissions.has("BAN_MEMBERS")) {
                return message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Bot nie ma permisji do wyrzucania **(**\`🔒 BAN_MEMBERS\`**)**`)]})
            }else if (!message.member.permissions.has("BAN_MEMBERS")) {
                return message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Nie posiadasz permisji do wyrzucania **(**\`🔒 BAN_MEMBERS\`**)**`)]})
            }

            if(!args[0]) return message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Poprawny schemat komendy\n\n\`\`\`diff\n+ unban <ID> [powód]\n\`\`\``)] })

            
            try {
                let target = await message.guild.bans.fetch((args[0]));
            } catch (e) {
                return message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Ten użytkownik nie jest na liście zbanowanych`)] })
            }

            if(!target){
                return message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Ten użytkownik nie jest na liście zbanowanych`)] })
            }

            message.guild.bans.fetch().then(banned => {
                let nick = banned.get((args[0])).user
                    message.guild.members.unban((args[0]));
                    const days = ["Niedziela","Poniedzialek","Wtorek","Sroda","Czwartek","Piatek","Sobota"];
                    const now = new Date();
                    const data = days[now.getDay()] + " " + now.getDate() + " " + now.getMonth() + " " + now.getFullYear() + " | " + now.getMinutes() + " " + now.getHours();
                    client.db.prepare('INSERT INTO history(user_id, guild_id, mod_id, action, reason, data) VALUES(?,?,?,?,?,?)').run(banned.get((args[0])).id, message.guild.id, message.author.id, "UNBAN", args.slice(1).join(" ").substring(0, 400) || `Brak`, data);
                    message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setDescription(`>>> ${emotki.tak} **${nick.tag}** został odbanowany przez **${message.author.tag}**\n\n\`\`\`diff\n- ${args.slice(1).join(" ") || `Brak`}\n\`\`\``).setColor("GREEN").setFooter(`${message.author.tag} | (${message.author.id})`, `${message.author.displayAvatarURL({dynamic: true})}`)] })

                    const modlog = client.db.prepare('SELECT * FROM serwer WHERE guild_id = ?').get(message.guild.id);
                    if(!modlog.channel_modlog)return

                        const sex = new MessageEmbed()
                        .setColor(`2f3136`)
                        .setAuthor(`🕵️‍♂️ Użytkownik został odbanowany ${target.user.tag}`)
                        .addField(`\`💥\` Odbanowano:`,`${target.user.tag} \`(${target})\``, true)
                        .addField(`\`🔱\` Moderator:`,`${message.author.tag}`, true)
                        .setTimestamp()
                        client.channels.cache.get(modlog.channel_modlog).send({ embeds: [sex]});
                    message.react("✅");
                    client.cooldown_5sec.add(message.author.id);
                    setTimeout(() => {
                      client.cooldown_5sec.delete(message.author.id);
                    }, 5000);
                    return;
                });
    }
}