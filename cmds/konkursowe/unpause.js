const { MessageEmbed } = require('discord.js')
const ms = require('ms');
const e = require('../../base/emotki.json');

module.exports = {
    name : 'unpause',
    aliases: ['unpausegiveaway', 'upg'],
    category : 'konkursowe',
    description : 'Wznawia giveaway',
    run : async(client, message, args) => {
        if(!message.member.permissions.has("MANGE_GUILD")){
            return message.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${e.not} **Wystąpił błąd**\n>>> Nie posiadasz uprawnienia: **ZARZĄDZANIE SERWEREM**`).setFooter(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())]})
        }
        if(!message.guild.me.permissions.has("MANGE_GUILD")){
            return message.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${e.not} **Wystąpił błąd**\n>>> Corfi nie posiada uprawnienia: **ZARZĄDZANIE SERWEREM**`).setFooter(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())]})
        }
        let messageId = (args[0])
        if(!messageId){
            return message.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${e.not} **Wystąpił błąd**\n>>> Podaj ID wiadomości z losowaniem`).setFooter(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())]})
        }
        client.giveawaysManager.unpause(messageId).then(() => {
            message.react("✅")
        }).catch((err) => {
            message.react("❌")
            return console.log(err);
        });
        client.cooldown_5sec.add(message.author.id);
        setTimeout(() => {
          client.cooldown_5sec.delete(message.author.id);
        }, 5000);
        return;
    }
}