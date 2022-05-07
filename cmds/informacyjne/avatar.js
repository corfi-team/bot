const {  MessageEmbed } = require("discord.js")
const emotki = require ('../../base/emotki.json');

module.exports = {
    name : 'avatar',
    category : 'informacyjne',
    description : 'Wyświetla avatar',
run : async(client, message, args) => {

    const member = message.mentions.members.first() || message.guild.members.cache.get((args[0])) || message.guild.members.cache.find(m => m.user.username == (args[0])) || message.member;

    message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed()
        .setColor(`RANDOM`)
        .setDescription(`[png](${member.user.displayAvatarURL({ format: 'png', size: 1024})}) | [jpg](${member.user.displayAvatarURL({ format: 'jpg', size: 1024 })}) | [gif](${member.user.displayAvatarURL({ format: 'gif', size: 1024, dynamic: true })}) | [webp](${member.user.displayAvatarURL({ format: 'webp', size: 1024 })})`)
        .setImage(member.user.displayAvatarURL({ dynamic: true, size: 1024}))], allowedMentions: { repliedUser: false }});
        client.cooldown_5sec.add(message.author.id);
        setTimeout(() => {
          client.cooldown_5sec.delete(message.author.id);
        }, 5000);
        return;
    }
}