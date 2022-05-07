const emotki = require ('../../base/emotki.json')
const { MessageEmbed } = require('discord.js');
const moment = require('moment-timezone')

module.exports = {
    name : 'user',
	aliases:[`user-info`],
    category : 'informacyjne',
    description : 'Informacje o użytkowniku',
    run : async(client, message, args) => {
        moment.locale(`pl`);

        const oznaczuser = message.mentions.members.first() || message.guild.members.cache.get((args[0])) || message.guild.members.cache.find(m => m.user.username == (args[0])) || message.member;            
        
        const userinfo = new MessageEmbed()
            .setColor(client.config.color)
            .setThumbnail(oznaczuser.displayAvatarURL({size: 1024, dynamic: true}))
            .addField("\`🙍‍♂️\` Nazwa", `> **\`${oznaczuser.user.tag}\`**`)
            .addField("\`👁‍🗨\` ID", `> **\`${oznaczuser.id}\`**`)
            .addField("\`🎭\` Oznaczenie", "> <@" + oznaczuser.id + ">", true)
            .addField("\`🌌\` Stworzył konto", `> **\`${moment(oznaczuser.user.createdAt).format('L')} (${moment(oznaczuser.user.createdAt, "YYYYMMDD").fromNow()})\`**`)
            .addField("\`⚡\` Dołączył", `> **\`${moment(oznaczuser.joinedAt).format(`L`)} (${moment(oznaczuser.joinedAt, "YYYYMMDD").fromNow()})\`**`)
            .setFooter({text :`${message.author.tag} | (${message.author.id})`,iconURL :`${message.author.displayAvatarURL({dynamic: true})}`})
        message.reply({ allowedMentions: { repliedUser: false }, embeds: [userinfo]});

        client.cooldown_5sec.add(message.author.id);
        setTimeout(() => {
          client.cooldown_5sec.delete(message.author.id);
        }, 5000);
        return;
    }
}