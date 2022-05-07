const {MessageEmbed} = require('discord.js')
const emotki = require('../base/emotki.json')
module.exports = {
    name: "modlog",
    usage: "modlog <channel>",
    async run(message, args) {
        try{
            
            let men_kan = message.mentions.channels.first();
            if (!men_kan || men_kan.guild.id !== message.guild.id || !message.guild.channels.cache.find(c => c.id === men_kan.id) || men_kan.type == "GUILD_VOICE" || men_kan.type == "GUILD_NEWS" || men_kan.type == "GUILD_STAGE_VOICE") return message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setThumbnail(client.config.z_error).setDescription(`>>> ${emotki.not} Podano nieodpowiedni kanał!`)]})
        
            message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Kanał modlog został ustawiony na <#${men_kan.id}>`).setThumbnail(client.config.ustaw)]});
        
            let i = client.db.prepare(`SELECT channel_modlog FROM serwer WHERE guild_id = ?`).get(message.guild.id);
            if(i){
                return client.db.prepare('UPDATE serwer SET channel_modlog = ? WHERE guild_id = ?').run(men_kan.id, message.guild.id);
            }else{
                return client.db.prepare(`INSERT INTO serwer(guild_id, channel_modlog) VALUES(?,?)`).run(message.guild.id, men_kan.id);
            }
        }catch (err){
            console.log(err)
        }
    }
}