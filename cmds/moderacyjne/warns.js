const { MessageEmbed } = require('discord.js')
const emotki = require("../../base/emotki.json");

module.exports = {
    name : 'warns',
    aliases: ['warnings'],
    category : 'moderacyjne',
    description : 'WyĹ›wietla listÄ™ ostrzeĹĽeĹ„ uĹĽytkownika',
    run : async(client, message, args) => {

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(m => m.user.username ===(args[0])) || message.author

        if(!member) return message.reply({ allowedMentions: { repliedUser: false }, content: '> Nie znaleziono użytkownika, dla którego można znaleźć ostrzeżenia' })

        const baza = client.db.prepare('SELECT * FROM warns WHERE user_id = ? AND guild_id = ?').all(member.id, message.guild.id);

        if (!baza) return message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("#ff0000").setDescription(`>>> ${emotki.ban} ${member} **\`nie posiada ostrzeżeń\`**`)]})


                /**
                 * Creates an embed with guilds starting from an index.
                 * @param {number} start The index to start from.
                 */

                 client.cooldown_5sec.add(message.author.id);
                 setTimeout(() => {
                   client.cooldown_5sec.delete(message.author.id);
                 }, 5000);

                const generateEmbed = start => {
                    const current = baza.slice(start, start + 10)
                    const embed = new MessageEmbed()
                        .setDescription(`${emotki.ban} **Lista ostrzeżeń ${member} \`${start + 1}-${start + current.length}\` z \`${baza.length}\`**`)
                    current.forEach(r => embed.addField(`:small_red_triangle: **\`${r.numer}\`** ${emotki.support} Moderator ${message.guild.members.cache.get(r.mod_id).user.tag || "Dummy#0000"} **(** \`${r.mod_id}\` **)**`, `\n\`\`\`diff\n- ${r.reason.slice(0, 100)}\`\`\``))
                    return embed
                }
                const msg = message.channel.send({ embeds: [generateEmbed(0)] }).then(async (m) => {
                    if (baza.length <= 10) return
                    else {
                        await m.react("➡")
                        const filter = (reaction, user) => user.id === message.author.id
                        const collector = m.createReactionCollector({ filter, time: 30000});
                        let currentIndex = 0
                        collector.on('collect',async reaction => {
                            if (!reaction) return
                            else {
                              m.reactions.removeAll()
                              reaction.emoji.name === "⬅" ? currentIndex -= 10 : currentIndex += 10
                              m.edit({ embeds: [generateEmbed(currentIndex)] })
                              if (currentIndex !== 0) await m.react("⬅")
                              if (currentIndex + 10 < baza.length) m.react("➡")
                            }
                        })
                    }
                })
    }
}
