const { MessageEmbed } = require('discord.js')
const emotki = require ('./../../base/emotki.json')

module.exports = {
    name : 'set',
    aliases: ["ustaw", "settings"],
    category : 'moderacyjne',
    description : 'Skonfiguruj swój serwer',
run : async(client, message, args) => {

    let baza = client.db.prepare('SELECT prefix FROM serwer WHERE guild_id = ?').get(message.guild.id)
    const prefix = baza?.prefix || "%"

    if (!message.guild.me.permissions.has("MANAGE_CHANNELS")) {
        return message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Bot nie ma permisji do zarządzania serwerem **(\`🔐\`  MANAGE_GUILD)**`)]})
    }else if (!message.member.permissions.has("MANAGE_GUILD")) {
        return message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Nie posiadasz permisji do zarządzania serwerem **(\`🔐\` MANAGE_GUILD)**`)]})
    }

    let opcja = (args[0])

        if (opcja) {
            const setting = client.settings.get(opcja)
            if(!setting) return message.reply({embeds: [new MessageEmbed().setColor("RED")
            .setDescription(`>>> ${emotki.not} Wymagane podanie nazwy kategorii\n\n\`\`\`diff\n+ autorole \n+ logs \n+ meme \n+ suggestions \n+ prefix \n+ modlog \n+ leave \n+ join \n+ userrole \n+ autopublish\n+ automod \n+ verification\n+ statistics\n+ messagetop\n+ leveling\n\n- usun\n\`\`\``)
            .setFooter({text: `${prefix}set <kategoria> <wartość>`, iconURL: message.author.displayAvatarURL()})]});
            setting.run(message, args)
        } else if (!opcja) {
            const setting = client.settings.get(opcja)
            if(!setting) return message.reply({embeds: [new MessageEmbed().setColor("RED")
            .setDescription(`>>> ${emotki.not} Wymagane podanie nazwy kategorii\n\n\`\`\`diff\n+ autorole \n+ logs \n+ meme \n+ suggestions \n+ prefix \n+ modlog \n+ leave \n+ join \n+ userrole \n+ autopublish\n+ automod \n+ verification\n+ statistics\n+ messagetop\n+ leveling\n\n- usun\n\`\`\``)
            .setFooter({text: `${prefix}set <kategoria> <wartość>`, iconURL: message.author.displayAvatarURL()})]});
            setting.run(message, args)  
        }
    }
}
