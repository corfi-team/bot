const {MessageEmbed} = require('discord.js')
const emotki = require('../base/emotki.json')
module.exports = {
    name: "usun",
    usage: "usun <konfiguracja>",
    async run(message, args) {
        let konf = (args[1])
        let baza = client.db.prepare('SELECT prefix FROM serwer WHERE guild_id = ?').get(message.guild.id)
        const prefix = baza?.prefix || "%"
        try{
            if (!konf){
                return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Wymagane podanie nazwy kategorii\n\n\`\`\`diff\n- auto_role\n- logs\n- meme\n- suggestions\n- mod_log\n- user_role\n- join_channel\n- leave_channel\n- mute_role\n- autopublish\`\`\``).setFooter({text: `${prefix}set <usun> <wartość>`, iconURL : message.author.displayAvatarURL()})]})
            }

            if (konf === "join_channel") {
                client.db.prepare(`UPDATE member_add SET channel_id = null WHERE guild_id = ?`).run(message.guild.id)
                return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]})
            }
            else if (konf === "leave_channel") {
                client.db.prepare(`UPDATE member_papa SET channel_id = null WHERE guild_id = ?`).run(message.guild.id)
                return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]})
            }
            else if (konf === "logs") {
                client.db.prepare(`UPDATE serwer SET channel_logs = null WHERE guild_id = ?`).run(message.guild.id)
                return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]})
            }
            else if (konf === "meme") {
                client.db.prepare(`UPDATE serwer SET channel_mems = null WHERE guild_id = ?`).run(message.guild.id)
                return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]})
            }
            else if (konf === "suggestions") {
                client.db.prepare(`UPDATE serwer SET channel_suggest = null WHERE guild_id = ?`).run(message.guild.id)
                return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]})
            }
            else if (konf === "mod_log") {
                client.db.prepare(`UPDATE serwer SET channel_modlog = null WHERE guild_id = ?`).run(message.guild.id)
                return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]})
            }
            else if (konf === "user_role") {
                client.db.prepare(`UPDATE serwer SET userrole = null WHERE guild_id = ?`).run(message.guild.id)
                return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]})
            }
            else if (konf = 'autopublish') {
                client.db.prepare(`UPDATE serwer SET autopubliker = null WHERE guild_id = ?`).run(message.guild.id)
                return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]})
            }
        }catch (err){
            console.log(err)
        }
    }
}