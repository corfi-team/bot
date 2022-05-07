const {MessageEmbed} = require('discord.js')
const emotki = require('../base/emotki.json')
module.exports = {
    name: "logs",
    usage: "logs <kanal>",
async run(message, args) {
    try{

            let men_kan = message.mentions.channels.first();

            if (!men_kan || men_kan.guild.id !== message.guild.id || !message.guild.channels.cache.find(c => c.id === men_kan.id) || men_kan.type == "GUILD_VOICE" || men_kan.type == "GUILD_NEWS" || men_kan.type == "GUILD_STAGE_VOICE") return message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setThumbnail(client.config.z_error).setDescription(`>>> ${emotki.not} Podano nieodpowiedni kanał logów!`)]})

            message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Kanał do logów został ustawiony na <#${men_kan.id}>`).setThumbnail(client.config.ustaw)]});

            let i = client.db.prepare(`SELECT channel_logs FROM serwer WHERE guild_id = ?`).get(message.guild.id);
            if(i){
                return client.db.prepare(`UPDATE serwer SET channel_logs = ? WHERE guild_id = ?`).run(men_kan.id, message.guild.id)
            }else{
                return client.db.prepare(`INSERT INTO serwer(guild_id, channel_logs) VALUES(?,?)`).run(message.guild.id, men_kan.id);
            }

        }catch (err){
            console.log(err)
            let error = new MessageEmbed()
                .setColor("RED")
                .setTitle(`Błąd w komendzie set logs`)
                .setDescription(`> Wystąpił błąd podczas używania komendy`)
            message.reply({ allowedMentions: { repliedUser: false }, ephemeral: true, embeds: [error]});

            embed = new MessageEmbed()
                .setColor("RED")
                .setTitle(`Błąd w komendzie set logs`)
                .setDescription(`**Użytkownik:** ${message.author.tag}  (\`${message.author.id}\`) \n**Serwer:** ${message.guild.name}  (\`${message.guild.id}\`)\n\`\`\`js\n${err}\n\`\`\``)
            return client.channels.cache.get(client.config.error).send({ephemeral: true, embeds: [embed]});
        }
    }
}