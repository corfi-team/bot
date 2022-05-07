/*
const {MessageEmbed} = require('discord.js')
const emotki = require('../base/emotki.json')
module.exports = {
    name: "muterole",
    usage: "muterole <rola>",
    async run(message, args) {
        try{
            let men_rola =
                message.guild.roles.cache.get(args[1]) ||
                message.guild.roles.cache.find(x => x.name === args.join(" ")) ||
                message.mentions.roles.first();

            if (!men_rola) {
                return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Oznacz rolę dla osoby wyciszonej`)]})
            }

            if(!message.guild.roles.cache.get(men_role.id)){
                return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Oznacz rolę dla osoby wyciszonej`)]})
            }

            message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Rola dla osoby wyciszonej została ustawiona na ${message.guild.roles.cache.get(men_rola.id)}`).setThumbnail(client.config.ustaw)]});

                message.guild.channels.cache.forEach(channel => {

                if(channel.type === "GUILD_TEXT")

                    channel.permissionOverwrites.edit(men_rola, { SEND_MESSAGES: false, SPEAK: false }).catch(false)
                })


            let i = client.db.prepare(`SELECT mute_role FROM serwer WHERE guild_id = ?`).get(message.guild.id);
            if(i){
                return client.db.prepare('UPDATE serwer SET mute_role = ? WHERE guild_id = ?').run(men_rola.id, message.guild.id);
            }else{
                return client.db.prepare(`INSERT INTO serwer(guild_id, mute_role) VALUES(?,?)`).run(message.guild.id, men_rola.id);
            }
        }catch (err){
            console.log(err)
            let error = new MessageEmbed()
            .setColor("RED")
                .setTitle(`Błąd w komendzie set muterole`)
                .setDescription(`> Wystąpił błąd podczas używania komendy`)
            message.reply({ allowedMentions: { repliedUser: false }, ephemeral: true, embeds: [error]});

            embed = new MessageEmbed()
            .setColor("RED")
                .setTitle(`Błąd w komendzie set muterole`)
                .setDescription(`**Użytkownik:** ${message.author.tag}  (\`${message.author.id}\`) \n**Serwer:** ${message.guild.name}  (\`${message.guild.id}\`)\n\`\`\`js\n${err}\n\`\`\``)
            return client.channels.cache.get(client.config.error).send({ephemeral: true, embeds: [embed]});
        }
    }
}
*/