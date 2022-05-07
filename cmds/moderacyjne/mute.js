const { MessageEmbed } = require('discord.js')
const emotki = require ('../../base/emotki.json')
const ms = require('ms')

module.exports = {
    name : 'mute',
    category : 'moderacyjne',
    description : 'Wycisza użytkownika',
    run : async(client, message, args) => {


        if (!message.guild.me.permissions.has("MUTE_MEMBERS")) {
            return message.reply({allowedMentions: { repliedUser: false }, embeds: [ new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Bot nie ma permisji do wyciszania użytkowników **(**\`🔒 MUTE_MEMBERS\`**)**`)]})
        }else if (!message.member.permissions.has("MUTE_MEMBERS")) {
            return message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Nie posiadasz permisji do wyciszania użytkowników **(**\`🔒 MUTE_MEMBERS\`**)**`)]})
        }
        const user = message.mentions.members.first() || message.guild.members.cache.get((args[0]));

        let timeArg = args[1]
        let reason = [...args].slice(2).join(' ')
        if(!user) return message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Oznacz osobe którą mam wysiszyć!`)]})
        if(user.isCommunicationDisabled()) return message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Tego użytkownika nie mogę wysiszyć!`)]})
        if(user == message.member || user.user.id === client.id) return message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Nie możesz wysiszyć siebie ani bota!`)]})
        if(!timeArg) return message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Podaj czas! (1m, 1h, 1d)`)]})
        const time = ms(timeArg)
        if(!time) return message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Poprawe użycie komendy! \`\`\`\n + mute @user 2h Corfi\`\`\``)]})
        if(time < 60000) return message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Czas nie może być krótszy niż 1m!`)]})
        if(time > 604800000) return message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Czas nie może być dłuszy niż 7d!`)]})
        if(!reason) reason = "Brak"
        if(message.member.roles.highest.position <= user.roles.highest.position && message.guild.ownerId !== message.author.id || message.guild.ownerId === user.id) return  message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Twoja rola znajduje się wyżej niż rola oznaczonej osoby!`)]})
        if(!user.moderatable) return message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Nie mogę wysiszyć tej osoby!`)]})
        user.timeout(time, reason).then(function () {
            message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.yes} Wysiszono!`)]})
        })

    }
}