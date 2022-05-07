const {MessageEmbed} = require('discord.js')
const emotki = require('../base/emotki.json')
module.exports = {
    name: "userrole",
    usage: "userrole <role>",
    async run(message, args) {
        try{
            let men_role = message.guild.roles.cache.get(args[1]) || message.mentions.roles.first();

            if (!men_role){
                const error = new MessageEmbed()
                    .setColor("RED")
                    .setThumbnail(client.config.z_error)
                    .setDescription(`>>> ${emotki.not} Oznacz rolę, która ma być rolą użytkownika \n\`\`\`diff\n+ Pamiętaj, że rola bota musi być na rolą, którą oznaczyłeś!\n\`\`\``)
                return message.reply({embeds: [error]});
            }

            if (!message.guild.roles.cache.get(men_role.id)) {
                return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not}  Oznacz rolę, która ma być rolą użytkownika \n\`\`\`diff\n+ Pamiętaj, że rola bota musi być na rolą, którą oznaczyłeś!\n\`\`\``).setThumbnail(client.config.ustaw)]})
            }

            message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Rola została ustawiona na <@&${men_role.id}> \`(${men_role.name})\``)]})

            let i = client.db.prepare(`SELECT userrole FROM serwer WHERE guild_id = ?`).get(message.guild.id);
            if(i){
                return client.db.prepare('UPDATE serwer SET userrole = ? WHERE guild_id = ?').run(men_role.id, message.guild.id);
            }else{
                return client.db.prepare(`INSERT INTO serwer(guild_id, userrole) VALUES(?,?)`).run(message.guild.id, men_role.id);
            }
        }catch (err){
            console.log(err)
            let error = new MessageEmbed()
            .setColor("RED")
                .setTitle(`Błąd w komendzie set userrole`)
                .setDescription(`> Wystąpił błąd podczas używania komendy`)
            message.reply({embeds: [error]});

            embed = new MessageEmbed()
            .setColor("RED")
                .setTitle(`Błąd w komendzie set userrole`)
                .setDescription(`**Użytkownik:** ${message.author.tag}  (\`${message.author.id}\`) \n**Serwer:** ${message.guild.name}  (\`${message.guild.id}\`)\n\`\`\`js\n${err}\n\`\`\``)
            return client.channels.cache.get(client.config.error).send({ephemeral: true, embeds: [embed]});
        }
    }
}