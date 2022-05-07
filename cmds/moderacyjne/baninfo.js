const { Discord, MessageActionRow, MessageSelectMenu, MessageEmbed } = require("discord.js");
const emotki = require ('../../base/emotki.json')

module.exports = {
    name : 'baninfo',
    aliases: ['ban-info'],
    category : 'moderacyjne',
    description : 'Wyswitla informacje o zbanowanym uzytkowniku',
    run : async(client, message, args) => {

        if (!message.member.permissions.has("KICK_MEMBERS")) {
            return message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Nie posiadasz permisji do przeglądania banów **(**\`🔒 KICK_MEMBERS\`**)**`)] })
        }
        const bot = {
            true: "Tak",
            false: "Nie"
        }
        if(!args[0]) return message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Poprawny schemat komendy\n\n\`\`\`diff\n+ baninfo <ID>\n\`\`\``)] })
        message.guild.bans.fetch().then(banned => {
            let user = banned.get((args[0]))
            message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("GREEN")
            .setDescription(`>>> ${emotki.ban} **Informacje o banie** \n\`\`\`diff\n+ NICK: ${user.user.tag}\n+ BOT: ${bot[user.user.bot]}\n+ ID: ${user.user.id}\n\n- Powód: ${user.reason.slice(0, 300)}\n\`\`\``)
            .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))] })
            client.cooldown_5sec.add(message.author.id);
            setTimeout(() => {
              client.cooldown_5sec.delete(message.author.id);
            }, 5000);
            return;
            });
    }
}