const { MessageEmbed } = require('discord.js')
const emotki = require ('../../base/emotki.json')

module.exports = {
    name : 'unmute',
    category : 'moderacyjne',
    description : 'Odcisza użytkownika',
    run : async(client, message, args) => {
        let user = message.mentions.members.first() || message.guild.members.cache.get(user.id)
        if(!user) return message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Oznacz osobe którą chcesz odciszyć!`)]})
        if(!user.isCommunicationDisabled()) return message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Ten użytkownik nie jest wyciszony!`)]})
        if(!user.moderatable) return message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Nie mogę tego wykonać!`)]})
        user.timeout(null).then(function () {
            return message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Udało się!`)]})
        })
    }
}