const { Discord, MessageActionRow, MessageSelectMenu, MessageEmbed } = require("discord.js");
const emotki = require ('../../base/emotki.json')

module.exports = {
    name : 'bans',
    aliases: ['ban-list'],
    category : 'moderacyjne',
    description : 'Wyswitla liste zbanowanych',
    run : async(client, message, args) => {
        if (!message.member.permissions.has("KICK_MEMBERS")) {
            return message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Nie posiadasz permisji do przeglądania listy zbanowanych **(**\`🔒 KICK_MEMBERS\`**)**`)]})
        }
        message.guild.bans.fetch()
        .then(banned => {
            let list = banned.map(ban => "+ " + ban.user.tag + " (" +  ban.user.id + ")").join('\n');
            if (!list) list = "- Brak zbanowanych użytkowników";
            if (list.length >= 1950) list = `${list.slice(0, 1900)}...`;
            message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed()
            .setDescription(`>>> ${emotki.ban} **Lista Zbanowanych** \n\`\`\`diff\n${list}\n\`\`\``)
            .setColor("GREEN")
            .setFooter(`${message.author.tag} | (${message.author.id})`, `${message.author.displayAvatarURL({dynamic: true})}`)] })
            client.cooldown_5sec.add(message.author.id);
            setTimeout(() => {
              client.cooldown_5sec.delete(message.author.id);
            }, 5000);
            return;
        })
    }
}