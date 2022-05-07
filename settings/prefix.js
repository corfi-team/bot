const {MessageEmbed} = require('discord.js')
const emotki = require('../base/emotki.json')
module.exports = {
    name: "prefix",
    usage: "prefix <prefix>",
    async run(message, args) {
        try{

            let prefixx = args[1]

            if (!prefixx) {
                const error = new MessageEmbed()
                    .setColor("RED")
                    .setThumbnail(client.config.z_error)
                    .setDescription(`>>> ${emotki.not} **\`Podaj nowy prefix komend!\`** (\`default: %\`)`)
                return message.reply({embeds: [error]});
            }

            if(prefixx === "^"){
                const error = new MessageEmbed()
                    .setColor(`ff0000`)
                    .setThumbnail(client.config.z_error)
                    .setDescription(`>>> ${emotki.not} Nie można ustawić takiego prefixu`)
                return message.reply({embeds: [error]});
            }

            if(prefixx.length > 2) {
                const error = new MessageEmbed()
                    .setColor("RED")
                    .setThumbnail(client.config.z_error)
                    .setDescription(`>>> ${emotki.not} Podany prefix jest za długi (\`max. 2 znaki\`)`)
                return message.reply({embeds: [error]});
            }

            let i = client.db.prepare(`SELECT prefix FROM serwer WHERE guild_id = ?`).get(message.guild.id);
            if(i){
                client.db.prepare(`UPDATE serwer SET prefix = ? WHERE guild_id = ?`).run(prefixx, message.guild.id)
            }else{
                client.db.prepare(`INSERT INTO serwer(guild_id, prefix) VALUES(?,?)`).run(message.guild.id, prefixx);
            }
            return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Prefix komend został zmieniony na \`${prefixx}\``).setThumbnail(client.config.ustaw)]})
        }catch (err){
            console.log(err)
            const error = new MessageEmbed()
                .setColor("RED")
                .setTitle(`Błąd w komendzie set prefix`)
                .setDescription(`> Wystąpił błąd podczas używania komendy`)
            message.reply({ allowedMentions: { repliedUser: false }, ephemeral: true, embeds: [error]});

            embed = new MessageEmbed()
                .setColor('#ff3042')
                .setTitle(`Błąd w komendzie set prefix`)
                .setDescription(`**Użytkownik:** ${message.author.tag}  (\`${message.author.id}\`) \n**Serwer:** ${message.guild.name}  (\`${message.guild.id}\`)\n\`\`\`js\n${err}\n\`\`\``)
            return client.channels.cache.get(client.config.error).send({ephemeral: true, embeds: [embed]});
        }
    }
}