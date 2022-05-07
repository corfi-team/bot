const { MessageEmbed, WebhookClient } = require('discord.js');

module.exports = {
    name : 'ogloszenie',
    category : 'developerskie',
    description : 'Wysyła changelog na kanał',
    run : async(client, message, args) => {

		if (!client.config.devs.includes(message.author.id)) return
            
        message.channel.createWebhook(`Ogłoszenie 🔧`,{
            avatar: message.guild.iconURL({ dynamin: true, format: `png`})
        }).then(wehbook => {
            wehbook.send({content: `${args.slice(0).join(" ")}` }).then(() => {
                wehbook.delete()
                message.delete()
            })
        })
    }
}