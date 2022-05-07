const {MessageEmbed} = require('discord.js')
const emotki = require('../base/emotki.json')
module.exports = {
    name: "autopublish",
    usage: "autopublish <on/off>",
    async run(message, args) {
        let konf = (args[1])
        if (!client.db.prepare('SELECT * FROM premium WHERE id = ?').get(message.guild.id) && !client.db.prepare('SELECT * FROM premium WHERE id = ?').get(message.author.id)) {
            const error = new MessageEmbed()
                .setColor("RED")
                .setAuthor({name: `${message.author.username} premium!`, iconURL: `${message.author.displayAvatarURL({})}`})
                .setDescription(`>>> \`\`\`diff\n- Ta konfiguracja wymaga posiadania premium! \n\`\`\``)
                .setThumbnail(client.config.z_error) 
            return message.reply({embeds: [error]})
        }
        else {
            if(!konf){
                return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.tak} Wybierz odpowiednią opcje : \n\n\`\`\`diff\n+ on (Włączone)\n+ off (Wyłączone)\`\`\``).setFooter(`${message.author.tag} | (${message.author.id})`, `${message.author.displayAvatarURL({dynamic: true})}`)]})
            }

            if(konf === 'on'){
                let i = client.db.prepare(`SELECT autopubliker FROM serwer WHERE guild_id = ?`).get(message.guild.id);
                if(i){
                    client.db.prepare('UPDATE serwer SET autopubliker = ? WHERE guild_id = ?').run("on", message.guild.id);
                }else{
                    client.db.prepare(`INSERT INTO serwer(guild_id, autopubliker) VALUES(?,?)`).run(message.guild.id, "on");
                }
                return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Auto Publikowanie zostało włączone!`).setFooter(`${message.author.tag} | (${message.author.id})`, `${message.author.displayAvatarURL({dynamic: true})}`)]})
            }
            if(konf === 'off'){
                let i = client.db.prepare(`SELECT autopubliker FROM serwer WHERE guild_id = ?`).get(message.guild.id);
                if(i){
                    client.db.prepare('UPDATE serwer SET autopubliker = ? WHERE guild_id = ?').run("off", message.guild.id);
                }else{
                    client.db.prepare(`INSERT INTO serwer(guild_id, autopubliker) VALUES(?,?)`).run(message.guild.id, "off");
                }
                return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Auto Publikowanie zostało wyłączone!`).setFooter(`${message.author.tag} | (${message.author.id})`, `${message.author.displayAvatarURL({dynamic: true})}`)]})
            }
        }
    }
}