const { MessageActionRow, MessageButton, MessageEmbed, Collector , MessageComponentInteraction } = require('discord.js')
const { writeFileSync, readFileSync } = require('fs')

module.exports = {
    name : 'break',
    aliases: ['tb', 'przerwa', 'maintenance'],
    category : 'developerskie',
    description : 'Włącza przerwę techniczną',
    run : async (client, message, args) => {

        if (!client.config.devs.includes(message.author.id)) return
        else if (args.length) return
        else {

            const value = JSON.parse(readFileSync('./break.json')).break
            let text = ''
            switch (value) {

                case true:
                case 'true': {

                    writeFileSync('./break.json', JSON.stringify({ break: "false" }))
                    client.user.setPresence({ activities: [{ name: `tEST` }] })

                    text = 'Wyłączono przerwę techniczną!'

                    break
                }

                case false:
                case 'false': {

                    writeFileSync('./../../../break.json', JSON.stringify({ break: "true" }))
                    client.user.setPresence({ activities: [{ name: `🚒 Przerwa techniczna` }] })

                    text = 'Włączono przerwę techniczną!'

                    break

                }
            }

            return message.reply({ allowedMentions: { repliedUser: false }, content: text})
        }
    }
}