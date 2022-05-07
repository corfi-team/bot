const { MessageEmbed } = require('discord.js');
const e = require('../../base/emotki.json');

module.exports = {
    name : 'ping',
    aliases: ['pong'],
    category : 'informacyjne',
    description : 'Zwraca ping bota',
    run : async(client, message, args) => {
        const msg = await message.channel.send(`${e.loading} Pingowanie...`)
        await message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor(client.config.color).setDescription(`${e.tick} **${client.ws.ping} ms**`)], allowedMentions: { repliedUser: false } })
        msg.delete()
        client.cooldown_5sec.add(message.author.id);
        setTimeout(() => {
          client.cooldown_5sec.delete(message.author.id);
        }, 5000);
        return
    }
}