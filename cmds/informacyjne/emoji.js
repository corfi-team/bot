const { MessageEmbed } = require("discord.js")
const emotki = require ('../../base/emotki.json')

module.exports = {
    name : 'emoji',
    category : 'informacyjne',
    description : 'Informacje o emotce',
run : async(client, message, args) => {

        if (!args[0]){
            const error = new MessageEmbed()
                .setColor(`RED`)
                .setThumbnail(client.config.z_error)
                .setDescription(`${emotki.not} Podaj nazwę lub ID emoji`)
            return message.reply({embeds: [error], allowedMentions: { repliedUser: false }});
        }
        let emoji = message.guild.emojis.cache.find(emoji => emoji.name === (args[0]) || emoji.id === (args[0]));
        if (!emoji){
            const error = new MessageEmbed()
            .setColor(`ff0000`)
            .setThumbnail(client.config.z_error)
            .setDescription(`${emotki.not} Emoji nie zostało znalezione`)
            return message.reply({embeds: [error], allowedMentions: { repliedUser: false }});
        }
        let a = null
        let x = "`"
        let galaxy;
        let link;
        let name = emoji.name
        let id = emoji.id
        let link1 = `https://cdn.discordapp.com/emojis/${id}`
        if (emoji.animated === true) {
            galaxy = `<a:${name}:${emoji.id}>`
            link = link1 + ".gif"
        } else {
            galaxy = `<:${name}:${emoji.id}>`
            link = link1 + ".png"
        }
        let mention = galaxy
        message.reply({embeds: [new MessageEmbed()
            .setColor(client.config.color)
            .setTitle(`Informacje o emoji`)
            .setThumbnail(link)
            .setDescription(`**Wygląd**\n> ${emoji}\n **Wzmianka**\n> ${x + mention + x}\n**Nazwa**\n> ${name}\n**ID**\n> ${id}`)
            .setURL(link)
            .setFooter({text :`${message.author.tag} | (${message.author.id})`,iconURL :`${message.author.displayAvatarURL({dynamic: true})}`})], allowedMentions: { repliedUser: false }})
            client.cooldown_5sec.add(message.author.id);
            setTimeout(() => {
              client.cooldown_5sec.delete(message.author.id);
            }, 5000);
        return;
    }
}