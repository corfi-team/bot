const {MessageEmbed} = require('discord.js')
const emotki = require('../base/emotki.json')
module.exports = {
    name: "autorole",
    usage: "",
    async run(message, args) {
        try{
            let rola2 = message.mentions.roles.first() || message.guild.roles.cache.get(args.join(" ")) || message.guild.roles.cache.find(x => x.name === args.join(" "))
            let men_role = message.mentions.roles || message.guild.roles.cache.get(args.join(" ")) || message.guild.roles.cache.find(x => x.name === args.join(" "))
            const roles = message.mentions.roles.map(x => x.id)
            let konf = (args[1])
            
            let baza = client.db.prepare('SELECT prefix FROM serwer WHERE guild_id = ?').get(message.guild.id)
            const prefix = baza?.prefix || "%"

            if (!konf){
                return message.reply({embeds: [new MessageEmbed().setColor("RED")
                .setDescription(`>>> ${emotki.not} Wymagane podanie nazwy kategorii\n\n\`\`\`diff\n+ bots\n+ user\n- usun\n\`\`\``)
                .setFooter({text: `${prefix}set <autorole> <wartość>`, iconURL: message.author.displayAvatarURL()})]});
            }
            if (konf === 'user') {
                if (!men_role || !rola2) {
                const error = new MessageEmbed()
                    .setColor("RED")
                    .setThumbnail(client.config.z_error)
                    .setDescription(`>>> ${emotki.not} Oznacz rolę, która ma być nadawana każdemu podczas wejścia na serwer \n\`\`\`diff\n+ Pamiętaj, że rola bota musi być wyższa niż rolą, którą oznaczyłeś!\n\`\`\``)
                return message.reply({embeds: [error]});
                }
                if (!message.guild.roles.cache.get(rola2.id)) {
                const error = new MessageEmbed()
                    .setColor("RED")
                    .setThumbnail(client.config.z_error)
                    .setDescription(`>>> ${emotki.not} Oznacz rolę, która ma być nadawana każdemu podczas wejścia na serwer \n\`\`\`diff\n+ Pamiętaj, że rola bota musi być wyższa niż rolą, którą oznaczyłeś!\n\`\`\``)
                return message.reply({embeds: [error]})
                }
                if (!client.db.prepare('SELECT * FROM premium WHERE id = ?').get(message.guild.id) && !client.db.prepare('SELECT * FROM premium WHERE id = ?').get(message.author.id)) {

                if (args[12] || !message.mentions.roles.first()){
                    const error = new MessageEmbed()
                        .setColor("RED")
                        .setAuthor({name: `${client.user.username} premium!`, iconURL: `${message.author.displayAvatarURL({})}`})
                        .setDescription(`>>> \`\`\`diff\n- Bez premium możesz ustawić maksymalnie 10 role! \n\`\`\``)
                        .setThumbnail(client.config.z_error)
                    return message.reply({embeds: [error]})   
                }
                let rolka = ""
                let roles1 = ""
                roles.forEach(rola => {
                    rolka += `${rola};`
                    roles1 += `<@&${rola}>, `
                });

                const yes = new MessageEmbed()
                    .setColor("GREEN")
                    .setThumbnail(client.config.ustaw)
                    .setDescription(`>>> ${emotki.tak} Role na start to: ${roles1}`)
                message.reply({embeds: [yes]})
                
                let i = client.db.prepare(`SELECT roles_id FROM member_add WHERE guild_id = ?`).get(message.guild.id);
                if(i){
                    return client.db.prepare(`UPDATE member_add SET roles_id = ? WHERE guild_id = ?`).run(rolka, message.guild.id)
                }else{
                    return client.db.prepare(`INSERT INTO member_add (guild_id, roles_id) VALUES(?,?)`).run(message.guild.id, rolka);
                }

                } else {
                if (args[22] || !message.mentions.roles.first()){
                    const error = new MessageEmbed()
                        .setColor("RED")
                        .setAuthor({name: `${message.author.username}!`, iconURL: `${message.author.displayAvatarURL({})}`})
                        .setDescription(`>>> \`\`\`diff\n- Maksymalna ilość ról to 20! \n\`\`\``)
                        .setThumbnail(client.config.z_error)
                    return message.reply({embeds: [error]})   
                }
                let rolka = ""
                let roles1 = ""
                roles.forEach(rola => {
                    rolka += `${rola};`
                    roles1 += `<@&${rola}>, `
                });

                const yes = new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`>>> ${emotki.tak} Role na start to: ${roles1}`)
                    .setThumbnail(client.config.ustaw)
                message.reply({embeds: [yes]})
                
                let i = client.db.prepare(`SELECT roles_id FROM member_add WHERE guild_id = ?`).get(message.guild.id);
                if(i){
                    return client.db.prepare(`UPDATE member_add SET roles_id = ? WHERE guild_id = ?`).run(rolka, message.guild.id)
                }else{
                    return client.db.prepare(`INSERT INTO member_add (guild_id, roles_id) VALUES(?,?)`).run(message.guild.id, rolka);
                }
                }
            }
            else if (konf === 'bots') {
            if (!men_role || !rola2) {
                const error = new MessageEmbed()
                    .setColor("RED")
                    .setThumbnail(client.config.z_error)
                    .setDescription(`>>> ${emotki.not} Oznacz rolę, która ma być nadawana każdemu podczas wejścia na serwer \n\`\`\`diff\n+ Pamiętaj, że rola bota musi być wyższa niż rolą, którą oznaczyłeś!\n\`\`\``)
                return message.reply({embeds: [error]});
            }
            if (!message.guild.roles.cache.get(rola2.id)) {
                const error = new MessageEmbed()
                    .setColor("RED")
                    .setThumbnail(client.config.z_error)
                    .setDescription(`>>> ${emotki.not} Oznacz rolę, która ma być nadawana każdemu podczas wejścia na serwer \n\`\`\`diff\n+ Pamiętaj, że rola bota musi być wyższa niż rolą, którą oznaczyłeś!\n\`\`\``)
                return message.reply({embeds: [error]})
            }
            if (!client.db.prepare('SELECT * FROM premium WHERE id = ?').get(message.guild.id) && !client.db.prepare('SELECT * FROM premium WHERE id = ?').get(message.author.id)) {

                if (args[12] || !message.mentions.roles.first()){
                    const error = new MessageEmbed()
                        .setColor("RED")
                        .setAuthor({name: `${client.user.username} premium!`, iconURL: `${message.author.displayAvatarURL({})}`})
                        .setDescription(`>>> \`\`\`diff\n- Bez premium możesz ustawić maksymalnie 10 role! \n\`\`\``)
                        .setThumbnail(client.config.z_error)
                    return message.reply({embeds: [error]})   
                }
                let rolka = ""
                let roles1 = ""
                roles.forEach(rola => {
                    rolka += `${rola};`
                    roles1 += `<@&${rola}>, `
                });

                const yes = new MessageEmbed()
                    .setColor("GREEN")
                    .setThumbnail(client.config.ustaw)
                    .setDescription(`>>> ${emotki.tak} Rola bota na start: ${roles1}`)
                message.reply({embeds: [yes]})
                
                let i = client.db.prepare(`SELECT roles_id FROM member_add WHERE guild_id = ?`).get(message.guild.id);
                if(i){
                    return client.db.prepare(`UPDATE member_add SET roles_bot_id = ? WHERE guild_id = ?`).run(rolka, message.guild.id)
                }else{
                    return client.db.prepare(`INSERT INTO member_add (guild_id, roles_bot_id) VALUES(?,?)`).run(message.guild.id, rolka);
                }

            } else {
                if (args[22] || !message.mentions.roles.first()){
                    const error = new MessageEmbed()
                        .setColor("RED")
                        .setAuthor({name: `${message.author.username}!`, iconURL: `${message.author.displayAvatarURL({})}`})
                        .setDescription(`>>> \`\`\`diff\n- Maksymalna ilość ról to 20! \n\`\`\``)
                        .setThumbnail(client.config.z_error)
                    return message.reply({embeds: [error]})   
                }
                let rolka = ""
                let roles1 = ""
                roles.forEach(rola => {
                    rolka += `${rola};`
                    roles1 += `<@&${rola}>, `
                });

                const yes = new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`>>> ${emotki.tak} Role na start to: ${roles1}`)
                    .setThumbnail(client.config.ustaw)
                message.reply({embeds: [yes]})
                
                let i = client.db.prepare(`SELECT roles_id FROM member_add WHERE guild_id = ?`).get(message.guild.id);
                if(i){
                    return client.db.prepare(`UPDATE member_add SET roles_bot_id = ? WHERE guild_id = ?`).run(rolka, message.guild.id)
                }else{
                    return client.db.prepare(`INSERT INTO member_add (guild_id, roles_bot_id) VALUES(?,?)`).run(message.guild.id, rolka);
                }
            }
            }
            else if (konf === 'usun') {
                if (!tzy) {
                    return message.reply({embeds: [new MessageEmbed().setColor("RED")
                    .setDescription(`>>> ${emotki.not} Wymagane podanie nazwy zmiennej\n\n\`\`\`diff\n- bots\n- user\n\`\`\``)
                    .setFooter({text: `${prefix}set <autorole> <usun> <zmienna>`, iconURL: message.author.displayAvatarURL()})]});
                }
                else if (tzy === 'bot') {
                    client.db.prepare(`UPDATE member_add SET roles_bot_id = null WHERE guild_id = ?`).run(message.guild.id)
                    return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]})

                }
                else if (tzy === 'user') {
                    client.db.prepare(`UPDATE member_add SET roles_id = null WHERE guild_id = ?`).run(message.guild.id)
                    return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]})
                }
            }
        }catch (err){
        console.log(err)
        let error = new MessageEmbed()
            .setColor("RED")
            .setTitle(`Błąd w komendzie set autorole`)
            .setDescription(`> Wystąpił błąd podczas używania komendy`)
        message.reply({ allowedMentions: { repliedUser: false }, ephemeral: true, embeds: [error]});

        embed = new MessageEmbed()
            .setColor("RED")
            .setTitle(`Błąd w komendzie set autorole`)
            .setDescription(`**Użytkownik:** ${message.author.tag}  (\`${message.author.id}\`) \n**Serwer:** ${message.guild.name}  (\`${message.guild.id}\`)\n\`\`\`js\n${err}\n\`\`\``)
        return client.channels.cache.get(client.config.error).send({ephemeral: true, embeds: [embed]});
        }
    }   
}