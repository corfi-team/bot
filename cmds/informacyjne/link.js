;const { MessageEmbed } = require("discord.js")
const emotki = require ('../../base/emotki.json')

module.exports = {
    name : 'link',
    aliases: ["invite", "dodaj", "links"],
    category : 'informacyjne',
    description : 'Wyświetla przydatne linki bota',
run : async(client, message, args) => {
        const zapro = new MessageEmbed()
            .setColor(client.config.color)
            .setAuthor({name :'Przydatne linki', iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})
            .addField(`>>> ${emotki.moderator} **Serwer Support**`, `:link: [Kliknij](https://discord.gg/UFYexxSUXt)`, true)
            .addField(`>>> ${emotki.invite} **Dodaj Bota**`, `:link: [Kliknij](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8)`, true)
            .addField(`>>> ${emotki.upvote} **Zagłosuj na Bota (Top.gg)**`, `:link: [Kliknij](https://top.gg/bot/813674836399620126)`, true)
        message.reply({ allowedMentions: { repliedUser: false }, ephemeral: true, embeds: [zapro], allowedMentions: { repliedUser: false }});
        client.cooldown_5sec.add(message.author.id);
        setTimeout(() => {
          client.cooldown_5sec.delete(message.author.id);
        }, 5000);
        return;
    }
}