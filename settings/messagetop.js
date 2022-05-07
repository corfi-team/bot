const {MessageEmbed} = require('discord.js')
const emotki = require('../base/emotki.json')

module.exports = {
    name: "messagetop",
    usage: "messagetop <on/off/message_delete_all>",
    async run(message, args) {
        switch (args[1]) {
            case 'włącz':
            case 'on': {
                message.reply({ embeds : [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.yes} Włączono licznik wiadomość!`).setFooter({text: `${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]})

                let i = client.db.prepare(`SELECT top_on FROM top_settings WHERE guild_id = ?`).get(message.guild.id);
                if(i){
                    return client.db.prepare('UPDATE top_settings SET top_on = ? WHERE guild_id = ?').run("on", message.guild.id);
                }else{
                    return client.db.prepare(`INSERT INTO top_settings(guild_id, top_on) VALUES(?,?)`).run(message.guild.id, "on");
                }
            }
            case 'wyłącz':
            case 'off': {
                message.reply({ embeds : [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.yes} Wyłączono licznik wiadomość!`).setFooter({text: `${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]})

                let i = client.db.prepare(`SELECT top_on FROM top_settings WHERE guild_id = ?`).get(message.guild.id);
                if(i){
                    return client.db.prepare('UPDATE top_settings SET top_on = ? WHERE guild_id = ?').run("off", message.guild.id);
                }else{
                    return client.db.prepare(`INSERT INTO top_settings(guild_id, top_on) VALUES(?,?)`).run(message.guild.id, "off");
                }
            }
            case 'message_delete_all':
            case 'mda': {
                message.reply({ embeds : [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.yes} Usunięte licznik wiadomość!`).setFooter({text: `${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]})
                return client.db.prepare(`UPDATE top SET ilosc = null WHERE guild_id = ?`).run(message.guild.id)
            }
            default: {
                return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Opcje konfiguracji modułu:\n\n\`\`\`diff\n+ on\n+ off\n- message_delete_all\`\`\``).setFooter({text :`${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]})
            }
        }
    }
}