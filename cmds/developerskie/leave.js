const { MessageActionRow, MessageButton, MessageEmbed, Collector , MessageComponentInteraction } = require('discord.js')
const emotki = require ("../../base/emotki.json")


module.exports = {
    name : 'leave',
    aliases: ['lv'],
    category : 'developerskie',
    description : 'Usuwa bota z serwera',
    run : async(client, message, args) => {

        if (!client.config.devs.includes(message.author.id)) return

        const leave = (args[0]);
        if(!leave){
            const error = new MessageEmbed()
                .setColor('#ff3042')
                .setTitle(`Odmowa dostepu`)
                .setDescription(`> ${emotki.not} Podaj ID serwera!`)
            return message.reply({ allowedMentions: { repliedUser: false }, ephemeral: true, embeds: [error]});
        }
        if(client.guilds.cache.find(g => g.id === leave)){
            client.guilds.cache.get(leave).leave();
            message.react("✅");
        }else{
            const error = new MessageEmbed()
                .setColor('#ff3042')
                .setDescription(`> ${emotki.not} Brak takiego serwera!`)
            return message.reply({ allowedMentions: { repliedUser: false }, ephemeral: true, embeds: [error]});
        }
    }
}

