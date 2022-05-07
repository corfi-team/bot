const { MessageEmbed } = require('discord.js')
const emotki = require ('../../base/emotki.json')

module.exports = {
    name : 'clearwarn',
    aliases: ['clear-warn', 'clearwarnings', 'clear-warnings'],
    category : 'moderacyjne',
    description : 'Usuwa ostrzeżenia użytkownika',
    run : async(client, message, args) => {

            if (!message.member.permissions.has("BAN_MEMBERS")) {
                return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Nie posiadasz permisji do usuwania ostrzeżeń **(**\`🔒 BAN_MEMBERS\`**)**`)]})
            }

            let member = message.mentions.members.first() || message.guild.members.cache.get((args[0])) || message.guild.members.cache.find(m => m.user.username == (args[0]));

            if(!member || member.bot){
                if(!args[0]) return message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("#ff0000").setDescription(`>>> ${emotki.not} Poprawny schemat komendy\n\n\`\`\`diff\n+ clearwarn <@user>\n+ clearwarn <User>\n+ clearwarn <ID>\n\`\`\``)] })
            }

            const baza = client.db.prepare('SELECT numer, user_id, mod_id, reason FROM warns WHERE user_id = ? AND guild_id = ?').all(member.id, message.guild.id);
                if(!baza){
                    return message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("#ff0000").setDescription(`>>> ${emotki.not} ${member} nie posiada ostrzeżeń`)]})
                }else{
                let del = client.db.prepare('DELETE FROM warns WHERE user_id = ? AND guild_id = ?').run(member.id, message.guild.id);
                if(del.changes < 1){
                    return message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("#ff0000").setDescription(`>>> ${emotki.not} Nie usunięto żadnych ostrzeżeń\n`)], ephemeral: true})
                }
                const reason = args.slice(1).join(" ") || `Brak`
                const days = ["Niedziela","Poniedzialek","Wtorek","Sroda","Czwartek","Piatek","Sobota"];
                const now = new Date();
                const data = days[now.getDay()] + " " + now.getDate() + " " + now.getMonth() + " " + now.getFullYear() + " | " + now.getMinutes() + " " + now.getHours();
                client.db.prepare('INSERT INTO history(user_id, guild_id, mod_id, action, reason, data) VALUES(?,?,?,?,?,?)').run(member.id, message.guild.id, message.author.id, "CLEARWARNINGS", reason.substring(0, 400) || `Brak`, data);
                message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed()
                    .setDescription(`>>> ${emotki.tak} Usunąłeś wszystkie ostrzeżenia dla **${member.user.tag}**`)
                    .setColor("GREEN").setFooter(`${message.author.tag} | (${message.author.id})`, `${message.author.displayAvatarURL({dynamic: true})}`)], ephemeral: true})

                    const modlog = client.db.prepare('SELECT * FROM serwer WHERE guild_id = ?').get(message.guild.id);
                    if(!modlog.channel_modlog)return

                        const sex = new MessageEmbed()
                        .setColor(`2f3136`)
                        .setAuthor(`🕵️‍♂️ Użytkownik został oczyszczony z ostrzeżeń ${member.user.tag}`)
                        .addField(`\`💥\` Oczyszczono:`,`${member.user.tag} \`(${member.id})\``, true)
                        .addField(`\`🔱\` Moderator:`,`${message.author.tag}`, true)
                        .addField(`\`💾\` Powód`,`\`\`\`diff\n+ ${reason}\n\`\`\``)
                        .setTimestamp()
                        client.channels.cache.get(modlog.channel_modlog).send({ embeds: [sex]});
                    message.react("✅");
                    client.cooldown_5sec.add(message.author.id);
                    setTimeout(() => {
                      client.cooldown_5sec.delete(message.author.id);
                    }, 5000);
                    return;
                }
    }
}