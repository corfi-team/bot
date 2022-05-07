const { MessageEmbed, MessageActionRow, MessageButton  } = require('discord.js')
const emotki = require('../base/emotki.json')
module.exports = {
    name: "verification",
    usage: "verification <role / logs / channels>",
    async run(message, args) {

        let baza = client.db.prepare('SELECT prefix FROM serwer WHERE guild_id = ?').get(message.guild.id)
        const prefix = baza?.prefix || "%"

        let konf = (args[1])
        let tzy = (args[2])

        let rola2 = message.mentions.roles.first()
        let men_role = message.mentions.roles
        const roles = message.mentions.roles.map(x => x.id)

        let men_kan = message.guild.channels.cache.get(tzy) || message.guild.channels.cache.find((x) => x.name === tzy) || message.mentions.channels.first();
        


        if (!konf) {
            return message.reply({embeds: [new MessageEmbed().setColor("RED")
            .setDescription(`>>> ${emotki.not} Wymagane podanie nazwy kategorii\n\n\`\`\`diff\n+ channel\n+ role \n+ logs \n+ on \n+ off \n- usun\n\`\`\``)
            .setFooter({text: `${prefix}set <verification> <wartość>`, iconURL: message.author.displayAvatarURL()})]});
        }
        else if (konf === 'role') {
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
                    .setDescription(`>>> ${emotki.tak} Role po zweryfikowaniu : ${roles1}`)
                message.reply({embeds: [yes]})

                let i = client.db.prepare(`SELECT roles_id FROM wer WHERE guild_id = ?`).get(message.guild.id);
                if(i){
                    return client.db.prepare(`UPDATE wer SET roles_id = ? WHERE guild_id = ?`).run(rolka, message.guild.id)
                }else{
                    return client.db.prepare(`INSERT INTO wer (guild_id, roles_id) VALUES(?,?)`).run(message.guild.id, rolka);
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
                    .setDescription(`>>> ${emotki.tak} Role po zweryfikowaniu: ${roles1}`)
                    .setThumbnail(client.config.ustaw)
                message.reply({embeds: [yes]})
                
                let i = client.db.prepare(`SELECT roles_id FROM wer WHERE guild_id = ?`).get(message.guild.id);
                if(i){
                    return client.db.prepare(`UPDATE wer SET roles_id = ? WHERE guild_id = ?`).run(rolka, message.guild.id)
                }else{
                    return client.db.prepare(`INSERT INTO wer (guild_id, roles_id) VALUES(?,?)`).run(message.guild.id, rolka);
                }
            }
        }
        else if (konf === 'logs') {
            if (!men_kan || men_kan.guild.id !== message.guild.id || !message.guild.channels.cache.find(c => c.id === men_kan.id) || men_kan.type == "GUILD_VOICE" || men_kan.type == "GUILD_NEWS" || men_kan.type == "GUILD_STAGE_VOICE") return message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setThumbnail(client.config.z_error).setDescription(`>>> ${emotki.not} Podano nieodpowiedni kanał logów weryfikacyjnych!`)]})

            message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Kanał logów weryfikacyjnych ustawiony <#${men_kan.id}>`).setThumbnail(client.config.ustaw)]});

            let i = client.db.prepare(`SELECT channel_log_id FROM wer WHERE guild_id = ?`).get(message.guild.id);
            if(i){
                return client.db.prepare(`UPDATE wer SET channel_log_id = ? WHERE guild_id = ?`).run(men_kan.id, message.guild.id)
            }else{
                return client.db.prepare(`INSERT INTO wer(guild_id, channel_log_id) VALUES(?,?)`).run(message.guild.id, men_kan.id);
            }
        }
        else if (konf === 'channel') {
            const weryfikacja = client.db.prepare('SELECT * FROM wer WHERE guild_id = ?').get(message.guild.id);

            if (weryfikacja?.message_id != null) {
                const not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`> **Wychodzi na to że na tym serwerze jest już weryfikacja!** [Link](https://ptb.discord.com/channels/${message.guild.id}/${weryfikacja.channel_id}/${weryfikacja.message_id})\n
                    \`\`\`diff\n+ Jeśli chcesz usunąć weryfikacje uzyj komendy: \n- ${prefix}set verification usun channel\`\`\``)
                return message.reply({embeds: [not]})
            } else if (!weryfikacja?.message_id) {
                if (!men_kan || men_kan.guild.id !== message.guild.id || !message.guild.channels.cache.find(c => c.id === men_kan.id) || men_kan.type == "GUILD_VOICE" || men_kan.type == "GUILD_NEWS" || men_kan.type == "GUILD_STAGE_VOICE") return message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setThumbnail(client.config.z_error).setDescription(`>>> ${emotki.not} Podano nieodpowiedni kanał weryfikacyjny!`)]})
                const row = new MessageActionRow().addComponents(new MessageButton().setCustomId('weryf').setLabel("🧩 Kliknij aby się zweryfikować").setStyle("PRIMARY"))
    
                
                const yes = new MessageEmbed()
                    .setTitle("Weryfikacja")
                    .setDescription("> Aby się zweryfikować, kliknij w przycisk pod wiadomością!")
                    .setFooter({text: message.guild.name,  iconURL: message.guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL({ })})
                    .setColor(client.config.color)
                message.guild.channels.cache.get(men_kan.id).send({embeds: [yes],  components: [row]}).then(emb => {
                    let i = client.db.prepare(`SELECT message_id FROM wer WHERE guild_id = ?`).get(message.guild.id);
                    if(i){
                        client.db.prepare(`UPDATE wer SET message_id = ? WHERE guild_id = ?`).run(emb.id, message.guild.id)
                    }else{
                        client.db.prepare(`INSERT INTO wer(guild_id, message_id) VALUES(?,?)`).run(message.guild.id, emb.id);
                    }
                })

                message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Wysłałem weryfikacje na kanał <#${men_kan.id}>!`).setThumbnail(client.config.ustaw)]});

                let w = client.db.prepare(`SELECT channel_id FROM wer WHERE guild_id = ?`).get(message.guild.id);
                if(w){
                    return client.db.prepare(`UPDATE wer SET channel_id = ? WHERE guild_id = ?`).run(men_kan.id, message.guild.id)
                }else{
                    return client.db.prepare(`INSERT INTO wer(guild_id, channel_id) VALUES(?,?)`).run(message.guild.id, men_kan.id);
                }
            }
        }
        else if (konf === 'on') {

            message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Włączono weryfikacje na twoim serwerze!`).setThumbnail(client.config.ustaw)]});

            let i = client.db.prepare(`SELECT weryfikacja FROM wer WHERE guild_id = ?`).get(message.guild.id);
            if(i){
                return client.db.prepare(`UPDATE wer SET weryfikacja = ? WHERE guild_id = ?`).run("on", message.guild.id)
            }else{
                return client.db.prepare(`INSERT INTO wer(guild_id, weryfikacja) VALUES(?,?)`).run(message.guild.id, "on");
            }
        }
        else if (konf === 'off') {
            message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.tak} Wyłączyłem weryfikacje na twoim serwerze!`).setThumbnail(client.config.ustaw)]});

            let i = client.db.prepare(`SELECT weryfikacja FROM wer WHERE guild_id = ?`).get(message.guild.id);
            if(i){
                return client.db.prepare(`UPDATE wer SET weryfikacja = ? WHERE guild_id = ?`).run("off", message.guild.id)
            }else{
                return client.db.prepare(`INSERT INTO wer(guild_id, weryfikacja) VALUES(?,?)`).run(message.guild.id, "off");
            }
        }
        else if (konf === 'usun') {
            if (!tzy) {
                return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Wymagane podanie nazwy kategorii\n\n\`\`\`diff\n- channel\n- role\n- logs\`\`\``).setFooter({text: `${prefix}set <verification> <usun> <zmienna>`, iconURL : message.author.displayAvatarURL()})]})
            }
            else if (tzy === 'channel') {
                const weryfikacja = client.db.prepare('SELECT * FROM wer WHERE guild_id = ?').get(message.guild.id);
                if (!weryfikacja?.message_id && !weryfikacja?.channel_id) {
                    return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Mamy problem! \n\n\`\`\`diff\n- Wychodzi na to że weryfikacja nie jest skonfiguracji!\`\`\``).setFooter({text: `${prefix}set <verification> <channel> <zmienna>`, iconURL : message.author.displayAvatarURL()})]})
                }
                client.channels.cache.get(weryfikacja.channel_id).messages.fetch(weryfikacja.message_id)
                    .then(message => message.delete())
                    .catch(console.error);
                client.db.prepare(`UPDATE wer SET channel_id = null WHERE guild_id = ?`).run(message.guild.id)
                client.db.prepare(`UPDATE wer SET message_id = null WHERE guild_id = ?`).run(message.guild.id)

                return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]})
            }
            else if (tzy === 'role') {
                client.db.prepare(`UPDATE wer SET roles_id = null WHERE guild_id = ?`).run(message.guild.id)
                return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]})
            }
            else if (tzy === 'logs') {
                client.db.prepare(`UPDATE wer SET channel_log_id = null WHERE guild_id = ?`).run(message.guild.id)
                return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]})
            }
        }
    }
}