const {MessageEmbed} = require('discord.js')
const emotki = require('../base/emotki.json')
module.exports = {
    name: "automod",
    usage: "automod <antylink / antyping / bad-word>",
    async run(message, args) {
        let konf = (args[1])
        let tzy = (args[2])
        let forr = (args[3])
        let tery = (args[4]) 

        let baza = client.db.prepare('SELECT prefix FROM serwer WHERE guild_id = ?').get(message.guild.id)
        const prefix = baza?.prefix || "%"
        
        let men_role = message.mentions.roles
        let men_kanal = message.mentions.channels
        let rola2 = message.mentions.roles.first()
        let kanal2 = message.mentions.channels.first()
        const roles = message.mentions.roles.map(x => x.id)
        const kanale =  message.mentions.channels.map(x => x.id)

        if (!konf){
            return message.reply({embeds: [new MessageEmbed().setColor("RED")
            .setDescription(`>>> ${emotki.not} Wymagane podanie nazwy kategorii\n\n\`\`\`diff\n+ antylink \n+ antyping \n+ bad-word\n\`\`\``)
            .setFooter({text: `${prefix}set <automod> <wartość>`, iconURL: message.author.displayAvatarURL()})]});
        }
        else if (konf === 'antylink'){
            if (!tzy){
                return message.reply({embeds: [new MessageEmbed().setColor("RED")
                .setDescription(`>>> ${emotki.not} Wymagane podanie nazwy kategorii\n\n\`\`\`diff\n+ roles (Ignorowana rola (Lub więcej)) \n+ channel (Ignorowany kanał (Lub więcej))\n+ punishment (Kara za wysłanie linku)\n+ on\n+ off \n\n- usun\n\`\`\``)
                .setFooter({text: `${prefix}set <automod> <antylink> <zmienna>`, iconURL: message.author.displayAvatarURL()})]});    
            }
            else if (tzy === 'on'){
                message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została ustawiona!`)]})

                let i = client.db.prepare(`SELECT antylink FROM automod WHERE guild_id = ?`).get(message.guild.id);
                if(i){
                    return client.db.prepare(`UPDATE automod SET antylink = ? WHERE guild_id = ?`).run('on', message.guild.id)
                }else{
                    return client.db.prepare(`INSERT INTO automod (guild_id, antylink) VALUES(?,?)`).run(message.guild.id, 'on');
                } 
            }
            else if (tzy === 'off') {
                message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została ustawiona!`)]})

                let i = client.db.prepare(`SELECT antylink FROM automod WHERE guild_id = ?`).get(message.guild.id);
                if(i){
                    return client.db.prepare(`UPDATE automod SET antylink = ? WHERE guild_id = ?`).run('off', message.guild.id)
                }else{
                    return client.db.prepare(`INSERT INTO automod (guild_id, antylink) VALUES(?,?)`).run(message.guild.id, 'off');
                } 
            }
            else if (tzy === 'roles'){

                if (!men_role || !rola2) {
                        const error = new MessageEmbed()
                            .setColor("RED")
                            .setThumbnail(client.config.z_error)
                            .setDescription(`>>> ${emotki.not} Oznacz rolę, która ma być ignorowana przez antylink!`)
                        return message.reply({embeds: [error]});
                }
                else if (args[32] || !message.mentions.roles.first()){
                        const error = new MessageEmbed()
                            .setColor("RED")
                            .setAuthor({name: `${message.author.username}!`, iconURL: `${message.author.displayAvatarURL({})}`})
                            .setDescription(`>>> \`\`\`diff\n- Maksymalna ilość ról to 30! \n\`\`\``)
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
                    .setDescription(`>>> ${emotki.tak} Role ignorowane przez antylink: ${roles1}`)
                    .setThumbnail(client.config.ustaw)
                message.reply({embeds: [yes]})
                
                let i = client.db.prepare(`SELECT antylink_roles FROM automod WHERE guild_id = ?`).get(message.guild.id);
                if(i){
                    return client.db.prepare(`UPDATE automod SET antylink_roles = ? WHERE guild_id = ?`).run(rolka, message.guild.id)
                }else{
                    return client.db.prepare(`INSERT INTO automod (guild_id, antylink_roles) VALUES(?,?)`).run(message.guild.id, rolka);
                } 
            }
            else if (tzy === 'channel'){
                if (!men_kanal || !kanal2) {
                    const error = new MessageEmbed()
                        .setColor("RED")
                        .setThumbnail(client.config.z_error)
                        .setDescription(`>>> ${emotki.not} Oznacz kanał, która ma być ignorowana przez antylink! (Kanał musi być tekstowy)`)
                    return message.reply({embeds: [error]});
                }
                let kanalik = ""
                let channel = ""
                let kanalllllll = ""
                kanale.forEach(k => {
                    kanalik += `${k};`
                    channel += `<#${k}>, `
                    kanalllllll = `${k}`

                });

                const channel3 = message.guild.channels.cache.get(kanalllllll)
                if (!channel3 || channel3 && channel3.type !== "GUILD_TEXT"){
                    const error = new MessageEmbed()
                        .setColor("RED")
                        .setThumbnail(client.config.z_error)
                        .setDescription(`>>> ${emotki.not} Oznacz kanał, która ma być ignorowana przez antylink! (Kanał musi być tekstowy)`)
                    return message.reply({embeds: [error]});
                }

                if (args[32] || !kanal2){
                    const error = new MessageEmbed()
                        .setColor("RED")
                        .setAuthor({name: `${message.author.username}!`, iconURL: `${message.author.displayAvatarURL({})}`})
                        .setDescription(`>>> \`\`\`diff\n- Maksymalna ilość kanałów to 30! \n\`\`\``)
                        .setThumbnail(client.config.z_error)
                    return message.reply({embeds: [error]})   
                }

                const yes = new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`>>> ${emotki.tak} Kanał ignorowany przez antylink: ${channel}`)
                    .setThumbnail(client.config.ustaw)
                message.reply({embeds: [yes]})

                let i = client.db.prepare(`SELECT antylink_channel FROM automod WHERE guild_id = ?`).get(message.guild.id);
                if(i){
                    return client.db.prepare(`UPDATE automod SET antylink_channel = ? WHERE guild_id = ?`).run(kanalik, message.guild.id)
                }else{
                    return client.db.prepare(`INSERT INTO automod (guild_id, antylink_channel) VALUES(?,?)`).run(message.guild.id, kanalik);
                } 
            }
            else if (tzy === 'punishment'){
                if (!forr){
                    return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Wymagane podanie nazwy kategorii\n\n\`\`\`diff\n+ ban \n+ kick \n+ mute \n+ warn \n\n- usun\n\`\`\``).setFooter({text: `${prefix}set <automod> <antylink> <punishment> <zmienna>`, iconURL: message.author.displayAvatarURL()})]});    
                }
                else if (forr === 'ban'){
                    const yes = new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(`>>> ${emotki.tak} Kara za wysłanie linku: **Ban**`)
                        .setThumbnail(client.config.ustaw)
                    message.reply({embeds: [yes]})

                    let i = client.db.prepare(`SELECT antylink_kara FROM automod WHERE guild_id = ?`).get(message.guild.id);
                    if(i){
                        return client.db.prepare(`UPDATE automod SET antylink_kara = ? WHERE guild_id = ?`).run('ban', message.guild.id)
                    }else{
                        return client.db.prepare(`INSERT INTO automod (guild_id, antylink_kara) VALUES(?,?)`).run(message.guild.id, 'ban');
                    }
                }
                else if (forr === 'kick'){
                    const yes = new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(`>>> ${emotki.tak} Kara za wysłanie linku: **Kick**`)
                        .setThumbnail(client.config.ustaw)
                    message.reply({embeds: [yes]})

                    let i = client.db.prepare(`SELECT antylink_kara FROM automod WHERE guild_id = ?`).get(message.guild.id);
                    if(i){
                        return client.db.prepare(`UPDATE automod SET antylink_kara = ? WHERE guild_id = ?`).run('kick', message.guild.id)
                    }else{
                        return client.db.prepare(`INSERT INTO automod (guild_id, antylink_kara) VALUES(?,?)`).run(message.guild.id, 'kick');
                    }
                }
                else if (forr === 'mute'){
                    const yes = new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(`>>> ${emotki.tak} Kara za wysłanie linku: **Mute**`)
                        .setThumbnail(client.config.ustaw)
                    message.reply({embeds: [yes]})

                    let i = client.db.prepare(`SELECT antylink_kara FROM automod WHERE guild_id = ?`).get(message.guild.id);
                    if(i){
                        return client.db.prepare(`UPDATE automod SET antylink_kara = ? WHERE guild_id = ?`).run('mute', message.guild.id)
                    }else{
                        return client.db.prepare(`INSERT INTO automod (guild_id, antylink_kara) VALUES(?,?)`).run(message.guild.id, 'mute');
                    }
                }
                else if (forr === 'warn'){
                    const yes = new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(`>>> ${emotki.tak} Kara za wysłanie linku: **Warn**`)
                        .setThumbnail(client.config.ustaw)
                    message.reply({embeds: [yes]})

                    let i = client.db.prepare(`SELECT antylink_kara FROM automod WHERE guild_id = ?`).get(message.guild.id);
                    if(i){
                        return client.db.prepare(`UPDATE automod SET antylink_kara = ? WHERE guild_id = ?`).run('warn', message.guild.id)
                    }else{
                        return client.db.prepare(`INSERT INTO automod (guild_id, antylink_kara) VALUES(?,?)`).run(message.guild.id, 'warn');
                    }
                }

            }
            else if (tzy === 'usun'){
                if (!forr){
                    return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Wymagane podanie nazwy kategorii\n\n\`\`\`diff\n+ roles \n+ channel \n+ punishment\n\`\`\``).setFooter({text: `${prefix}set <automod> <antylink> <usun>`, iconURL: message.author.displayAvatarURL()})]});    
                }
                else if ( forr === 'roles'){
                    client.db.prepare(`UPDATE automod SET antylink_roles = null WHERE guild_id = ?`).run(message.guild.id)
                    return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]}) 
                }
                else if (forr === 'channel'){
                    client.db.prepare(`UPDATE automod SET antylink_channel = null WHERE guild_id = ?`).run(message.guild.id)
                    return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]}) 
                }
                else if (forr === 'punishment'){
                    client.db.prepare(`UPDATE automod SET antylink_kara = null WHERE guild_id = ?`).run(message.guild.id)
                    return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]})
                }
            }
        }
        else if (konf === 'antyping'){
            if (!tzy){
                return message.reply({embeds: [new MessageEmbed().setColor("RED")
                .setDescription(`>>> ${emotki.not} Wymagane podanie nazwy kategorii\n\n\`\`\`diff\n+ roles (Ignorowana rola (Lub więcej)) \n+ channel (Ignorowany kanał (Lub więcej))\n+ punishment (Kara za nadmierne pingowanie)\n+ pings\n+ on\n+ off \n\n- usun\n\`\`\``)
                .setFooter({text: `${prefix}set <automod> <antyping> <zmienna>`, iconURL: message.author.displayAvatarURL()})]});    
            }
            else if (tzy === 'on'){
                message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została ustawiona!`)]})

                let i = client.db.prepare(`SELECT antyping FROM automod WHERE guild_id = ?`).get(message.guild.id);
                if(i){
                    return client.db.prepare(`UPDATE automod SET antyping = ? WHERE guild_id = ?`).run('on', message.guild.id)
                }else{
                    return client.db.prepare(`INSERT INTO automod (guild_id, antyping) VALUES(?,?)`).run(message.guild.id, 'on');
                } 
            }
            else if (tzy === 'off') {
                message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została ustawiona!`)]})

                let i = client.db.prepare(`SELECT antyping FROM automod WHERE guild_id = ?`).get(message.guild.id);
                if(i){
                    return client.db.prepare(`UPDATE automod SET antyping = ? WHERE guild_id = ?`).run('off', message.guild.id)
                }else{
                    return client.db.prepare(`INSERT INTO automod (guild_id, antyping) VALUES(?,?)`).run(message.guild.id, 'off');
                } 
            }
            else if (tzy === 'roles'){

                if (!men_role || !rola2) {
                        const error = new MessageEmbed()
                            .setColor("RED")
                            .setThumbnail(client.config.z_error)
                            .setDescription(`>>> ${emotki.not} Oznacz rolę, która ma być ignorowana przez antyping!`)
                        return message.reply({embeds: [error]});
                }
                else if (args[32] || !message.mentions.roles.first()){
                        const error = new MessageEmbed()
                            .setColor("RED")
                            .setAuthor({name: `${message.author.username}!`, iconURL: `${message.author.displayAvatarURL({})}`})
                            .setDescription(`>>> \`\`\`diff\n- Maksymalna ilość ról to 30! \n\`\`\``)
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
                    .setDescription(`>>> ${emotki.tak} Role ignorowane przez antyping: ${roles1}`)
                    .setThumbnail(client.config.ustaw)
                message.reply({embeds: [yes]})
                
                let i = client.db.prepare(`SELECT antyping_roles FROM automod WHERE guild_id = ?`).get(message.guild.id);
                if(i){
                    return client.db.prepare(`UPDATE automod SET antyping_roles = ? WHERE guild_id = ?`).run(rolka, message.guild.id)
                }else{
                    return client.db.prepare(`INSERT INTO automod (guild_id, antyping_roles) VALUES(?,?)`).run(message.guild.id, rolka);
                } 
            }
            else if (tzy === 'channel'){
                if (!men_kanal || !kanal2) {
                    const error = new MessageEmbed()
                        .setColor("RED")
                        .setThumbnail(client.config.z_error)
                        .setDescription(`>>> ${emotki.not} Oznacz kanał, która ma być ignorowana przez antyping! (Kanał musi być tekstowy)`)
                    return message.reply({embeds: [error]});
                }
                let kanalik = ""
                let channel = ""
                let kanalllllll = ""
                kanale.forEach(k => {
                    kanalik += `${k};`
                    channel += `<#${k}>, `
                    kanalllllll = `${k}`

                });

                const channel3 = message.guild.channels.cache.get(kanalllllll)
                if (!channel3 || channel3 && channel3.type !== "GUILD_TEXT"){
                    const error = new MessageEmbed()
                        .setColor("RED")
                        .setThumbnail(client.config.z_error)
                        .setDescription(`>>> ${emotki.not} Oznacz kanał, która ma być ignorowana przez antyping! (Kanał musi być tekstowy)`)
                    return message.reply({embeds: [error]});
                }

                if (args[32] || !kanal2){
                    const error = new MessageEmbed()
                        .setColor("RED")
                        .setAuthor({name: `${message.author.username}!`, iconURL: `${message.author.displayAvatarURL({})}`})
                        .setDescription(`>>> \`\`\`diff\n- Maksymalna ilość kanałów to 30! \n\`\`\``)
                        .setThumbnail(client.config.z_error)
                    return message.reply({embeds: [error]})   
                }

                const yes = new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`>>> ${emotki.tak} Kanał ignorowany przez antyping: ${channel}`)
                    .setThumbnail(client.config.ustaw)
                message.reply({embeds: [yes]})

                let i = client.db.prepare(`SELECT antyping_channel FROM automod WHERE guild_id = ?`).get(message.guild.id);
                if(i){
                    return client.db.prepare(`UPDATE automod SET antyping_channel = ? WHERE guild_id = ?`).run(kanalik, message.guild.id)
                }else{
                    return client.db.prepare(`INSERT INTO automod (guild_id, antyping_channel) VALUES(?,?)`).run(message.guild.id, kanalik);
                } 
            }
            else if (tzy === 'punishment'){
                if (!forr){
                    return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Wymagane podanie nazwy kategorii\n\n\`\`\`diff\n+ ban \n+ kick \n+ mute \n+ warn \n\n- usun\n\`\`\``).setFooter({text: `${prefix}set <automod> <antylink> <punishment> <zmienna>`, iconURL: message.author.displayAvatarURL()})]});    
                }
                else if (forr === 'ban'){
                    const yes = new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(`>>> ${emotki.tak} Kara za wysłanie masowego pingu: **Ban**`)
                        .setThumbnail(client.config.ustaw)
                    message.reply({embeds: [yes]})

                    let i = client.db.prepare(`SELECT antyping_kara FROM automod WHERE guild_id = ?`).get(message.guild.id);
                    if(i){
                        return client.db.prepare(`UPDATE automod SET antyping_kara = ? WHERE guild_id = ?`).run('ban', message.guild.id)
                    }else{
                        return client.db.prepare(`INSERT INTO automod (guild_id, antyping_kara) VALUES(?,?)`).run(message.guild.id, 'ban');
                    }
                }
                else if (forr === 'kick'){
                    const yes = new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(`>>> ${emotki.tak} Kara za wysłanie masowego pingu: **Kick**`)
                        .setThumbnail(client.config.ustaw)
                    message.reply({embeds: [yes]})

                    let i = client.db.prepare(`SELECT antyping_kara FROM automod WHERE guild_id = ?`).get(message.guild.id);
                    if(i){
                        return client.db.prepare(`UPDATE automod SET antyping_kara = ? WHERE guild_id = ?`).run('kick', message.guild.id)
                    }else{
                        return client.db.prepare(`INSERT INTO automod (guild_id, antyping_kara) VALUES(?,?)`).run(message.guild.id, 'kick');
                    }
                }
                else if (forr === 'mute'){
                    const yes = new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(`>>> ${emotki.tak} Kara za wysłanie masowego pingu: **Mute**`)
                        .setThumbnail(client.config.ustaw)
                    message.reply({embeds: [yes]})

                    let i = client.db.prepare(`SELECT antyping_kara FROM automod WHERE guild_id = ?`).get(message.guild.id);
                    if(i){
                        return client.db.prepare(`UPDATE automod SET antyping_kara = ? WHERE guild_id = ?`).run('mute', message.guild.id)
                    }else{
                        return client.db.prepare(`INSERT INTO automod (guild_id, antyping_kara) VALUES(?,?)`).run(message.guild.id, 'mute');
                    }
                }
                else if (forr === 'warn'){
                    const yes = new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(`>>> ${emotki.tak} Kara za wysłanie masowego pingu: **Warn**`)
                        .setThumbnail(client.config.ustaw)
                    message.reply({embeds: [yes]})

                    let i = client.db.prepare(`SELECT antyping_kara FROM automod WHERE guild_id = ?`).get(message.guild.id);
                    if(i){
                        return client.db.prepare(`UPDATE automod SET antyping_kara = ? WHERE guild_id = ?`).run('warn', message.guild.id)
                    }else{
                        return client.db.prepare(`INSERT INTO automod (guild_id, antyping_kara) VALUES(?,?)`).run(message.guild.id, 'warn');
                    }
                }

            }
            else if (tzy === 'pings') {
                if (!forr){
                    return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Wymagane podanie nazwy kategorii\n\n\`\`\`diff\n+ member (Maksymalna ilość spingowanych osób w jednej wiadomość)\n+ roles (Maksymalna ilość spingowanych ról w jednej wiadomość\n\`\`\`\n>>> **UWAGA** Można wybrać od 2 do 9 pingów minimum, żeby antyping działał!`).setFooter({text: `${prefix}set <automod> <antylink> <pings> <zmienna>`, iconURL: message.author.displayAvatarURL()})]});    
                }
                else if (forr === 'member') {
                    if (new RegExp(`^[2-9]{1}$`, `i`).test(tery)) {
                        
                        message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.yes} Ustawiono na __${tery}__.\n Jeśli ktoś spinguje ${tery} osoby w jedenj wiadomość bot wykona akcje! `).setFooter({text :`${message.author.tag} | (${message.author.id})`,iconURL :`${message.author.displayAvatarURL({dynamic: true})}`})]});    
                        
                        let i = client.db.prepare(`SELECT antyping_ping_member FROM automod WHERE guild_id = ?`).get(message.guild.id);
                        if(i){
                            return client.db.prepare(`UPDATE automod SET antyping_ping_member = ? WHERE guild_id = ?`).run(tery, message.guild.id)
                        }else{
                            return client.db.prepare(`INSERT INTO automod (guild_id, antyping_ping_member) VALUES(?,?)`).run(message.guild.id, tery);
                        }
                    }
                }
                else if (forr === 'roles') {
                    if (new RegExp(`^[2-9]{1}$`, `i`).test(tery)) {
                        
                        message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.yes} Ustawiono na __${tery}__.\n Jeśli ktoś spinguje ${tery} role w jedenj wiadomość bot wykona akcje! `).setFooter({text :`${message.author.tag} | (${message.author.id})`,iconURL :`${message.author.displayAvatarURL({dynamic: true})}`})]});    
                        
                        let i = client.db.prepare(`SELECT antyping_ping_role FROM automod WHERE guild_id = ?`).get(message.guild.id);
                        if(i){
                            return client.db.prepare(`UPDATE automod SET antyping_ping_role = ? WHERE guild_id = ?`).run(tery, message.guild.id)
                        }else{
                            return client.db.prepare(`INSERT INTO automod (guild_id, antyping_ping_role) VALUES(?,?)`).run(message.guild.id, tery);
                        }
                    }
                    
                }
            }
            else if (tzy === 'usun'){
                if (!forr){
                    return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Wymagane podanie nazwy kategorii\n\n\`\`\`diff\n+ roles \n+ channel \n+ punishment\n+ pings\n\`\`\``).setFooter({text: `${prefix}set <automod> <antyping> <usun>`, iconURL: message.author.displayAvatarURL()})]});    
                }
                else if (forr === 'roles'){
                    client.db.prepare(`UPDATE automod SET antyping_role = null WHERE guild_id = ?`).run(message.guild.id)
                    return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]}) 
                }
                else if (forr === 'channel'){
                    client.db.prepare(`UPDATE automod SET antyping_channel = null WHERE guild_id = ?`).run(message.guild.id)
                    return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]}) 
                }
                else if (forr === 'punishment'){
                    client.db.prepare(`UPDATE automod SET antyping_kara = null WHERE guild_id = ?`).run(message.guild.id)
                    return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]})
                }
                else if (forr === 'pings') {
                    client.db.prepare(`UPDATE automod SET antyping_ping_member = null WHERE guild_id = ?`).run(message.guild.id)
                    client.db.prepare(`UPDATE automod SET antyping_ping_role = null WHERE guild_id = ?`).run(message.guild.id)
                    return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]}) 
                
                }
            }
        }
        else if (konf === 'bad-word'){
            if (!tzy){
                return message.reply({embeds: [new MessageEmbed().setColor("RED")
                .setDescription(`>>> ${emotki.not} Wymagane podanie nazwy kategorii\n\n\`\`\`diff\n+ roles (Ignorowana rola (Lub więcej)) \n+ channel (Ignorowany kanał (Lub więcej))\n+ punishment (Kara za przeklinanie)\n+ on\n+ off \n\n- usun\n\`\`\``)
                .setFooter({text: `${prefix}set <automod> <bad-word> <zmienna>`, iconURL: message.author.displayAvatarURL()})]});    
            }
            else if (tzy === 'on'){
                message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została ustawiona!`)]})

                let i = client.db.prepare(`SELECT antybadwords FROM automod WHERE guild_id = ?`).get(message.guild.id);
                if(i){
                    return client.db.prepare(`UPDATE automod SET antybadwords = ? WHERE guild_id = ?`).run('on', message.guild.id)
                }else{
                    return client.db.prepare(`INSERT INTO automod (guild_id, antybadwords) VALUES(?,?)`).run(message.guild.id, 'on');
                } 
            }
            else if (tzy === 'off') {
                message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została ustawiona!`)]})

                let i = client.db.prepare(`SELECT antybadwords FROM automod WHERE guild_id = ?`).get(message.guild.id);
                if(i){
                    return client.db.prepare(`UPDATE automod SET antybadwords = ? WHERE guild_id = ?`).run('off', message.guild.id)
                }else{
                    return client.db.prepare(`INSERT INTO automod (guild_id, antybadwords) VALUES(?,?)`).run(message.guild.id, 'off');
                } 
            }
            else if (tzy === 'roles'){

                if (!men_role || !rola2) {
                        const error = new MessageEmbed()
                            .setColor("RED")
                            .setThumbnail(client.config.z_error)
                            .setDescription(`>>> ${emotki.not} Oznacz rolę, która ma być ignorowana przez bad-word!`)
                        return message.reply({embeds: [error]});
                }
                else if (args[32] || !message.mentions.roles.first()){
                        const error = new MessageEmbed()
                            .setColor("RED")
                            .setAuthor({name: `${message.author.username}!`, iconURL: `${message.author.displayAvatarURL({})}`})
                            .setDescription(`>>> \`\`\`diff\n- Maksymalna ilość ról to 30! \n\`\`\``)
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
                    .setDescription(`>>> ${emotki.tak} Role ignorowane przez bad-word: ${roles1}`)
                    .setThumbnail(client.config.ustaw)
                message.reply({embeds: [yes]})
                
                let i = client.db.prepare(`SELECT antybadwords_role FROM automod WHERE guild_id = ?`).get(message.guild.id);
                if(i){
                    return client.db.prepare(`UPDATE automod SET antybadwords_role = ? WHERE guild_id = ?`).run(rolka, message.guild.id)
                }else{
                    return client.db.prepare(`INSERT INTO automod (guild_id, antybadwords_role) VALUES(?,?)`).run(message.guild.id, rolka);
                } 
            }
            else if (tzy === 'channel'){
                if (!men_kanal || !kanal2) {
                    const error = new MessageEmbed()
                        .setColor("RED")
                        .setThumbnail(client.config.z_error)
                        .setDescription(`>>> ${emotki.not} Oznacz kanał, która ma być ignorowana przez bad-word! (Kanał musi być tekstowy)`)
                    return message.reply({embeds: [error]});
                }
                let kanalik = ""
                let channel = ""
                let kanalllllll = ""
                kanale.forEach(k => {
                    kanalik += `${k};`
                    channel += `<#${k}>, `
                    kanalllllll = `${k}`

                });

                const channel3 = message.guild.channels.cache.get(kanalllllll)
                if (!channel3 || channel3 && channel3.type !== "GUILD_TEXT"){
                    const error = new MessageEmbed()
                        .setColor("RED")
                        .setThumbnail(client.config.z_error)
                        .setDescription(`>>> ${emotki.not} Oznacz kanał, która ma być ignorowana przez bad-word! (Kanał musi być tekstowy)`)
                    return message.reply({embeds: [error]});
                }

                if (args[32] || !kanal2){
                    const error = new MessageEmbed()
                        .setColor("RED")
                        .setAuthor({name: `${message.author.username}!`, iconURL: `${message.author.displayAvatarURL({})}`})
                        .setDescription(`>>> \`\`\`diff\n- Maksymalna ilość kanałów to 30! \n\`\`\``)
                        .setThumbnail(client.config.z_error)
                    return message.reply({embeds: [error]})   
                }

                const yes = new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`>>> ${emotki.tak} Kanał ignorowany przez bad-word: ${channel}`)
                    .setThumbnail(client.config.ustaw)
                message.reply({embeds: [yes]})

                let i = client.db.prepare(`SELECT antybadwords_channel FROM automod WHERE guild_id = ?`).get(message.guild.id);
                if(i){
                    return client.db.prepare(`UPDATE automod SET antybadwords_channel = ? WHERE guild_id = ?`).run(kanalik, message.guild.id)
                }else{
                    return client.db.prepare(`INSERT INTO automod (guild_id, antybadwords_channel) VALUES(?,?)`).run(message.guild.id, kanalik);
                } 
            }
            else if (tzy === 'punishment'){
                if (!forr){
                    return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Wymagane podanie nazwy kategorii\n\n\`\`\`diff\n+ ban \n+ kick \n+ mute \n+ warn \n\n- usun\n\`\`\``).setFooter({text: `${prefix}set <automod> <antylink> <punishment> <zmienna>`, iconURL: message.author.displayAvatarURL()})]});    
                }
                else if (forr === 'ban'){
                    const yes = new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(`>>> ${emotki.tak} Kara za wysłanie przekleństwa: **Ban**`)
                        .setThumbnail(client.config.ustaw)
                    message.reply({embeds: [yes]})

                    let i = client.db.prepare(`SELECT antybadwords_kara FROM automod WHERE guild_id = ?`).get(message.guild.id);
                    if(i){
                        return client.db.prepare(`UPDATE automod SET antybadwords_kara = ? WHERE guild_id = ?`).run('ban', message.guild.id)
                    }else{
                        return client.db.prepare(`INSERT INTO automod (guild_id, antybadwords_kara) VALUES(?,?)`).run(message.guild.id, 'ban');
                    }
                }
                else if (forr === 'kick'){
                    const yes = new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(`>>> ${emotki.tak} Kara za wysłanie przekleństwa: **Kick**`)
                        .setThumbnail(client.config.ustaw)
                    message.reply({embeds: [yes]})

                    let i = client.db.prepare(`SELECT antybadwords_kara FROM automod WHERE guild_id = ?`).get(message.guild.id);
                    if(i){
                        return client.db.prepare(`UPDATE automod SET antybadwords_kara = ? WHERE guild_id = ?`).run('kick', message.guild.id)
                    }else{
                        return client.db.prepare(`INSERT INTO automod (guild_id, antybadwords_kara) VALUES(?,?)`).run(message.guild.id, 'kick');
                    }
                }
                else if (forr === 'mute'){
                    const yes = new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(`>>> ${emotki.tak} Kara za wysłanie przekleństwa: **Mute**`)
                        .setThumbnail(client.config.ustaw)
                    message.reply({embeds: [yes]})

                    let i = client.db.prepare(`SELECT antybadwords_kara FROM automod WHERE guild_id = ?`).get(message.guild.id);
                    if(i){
                        return client.db.prepare(`UPDATE automod SET antybadwords_kara = ? WHERE guild_id = ?`).run('mute', message.guild.id)
                    }else{
                        return client.db.prepare(`INSERT INTO automod (guild_id, antybadwords_kara) VALUES(?,?)`).run(message.guild.id, 'mute');
                    }
                }
                else if (forr === 'warn'){
                    const yes = new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(`>>> ${emotki.tak} Kara za wysłanie przekleństwa: **Warn**`)
                        .setThumbnail(client.config.ustaw)
                    message.reply({embeds: [yes]})

                    let i = client.db.prepare(`SELECT antybadwords_kara FROM automod WHERE guild_id = ?`).get(message.guild.id);
                    if(i){
                        return client.db.prepare(`UPDATE automod SET antybadwords_kara = ? WHERE guild_id = ?`).run('warn', message.guild.id)
                    }else{
                        return client.db.prepare(`INSERT INTO automod (guild_id, antybadwords_kara) VALUES(?,?)`).run(message.guild.id, 'warn');
                    }
                }

            }
            else if (tzy === 'usun'){
                if (!forr){
                    return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Wymagane podanie nazwy kategorii\n\n\`\`\`diff\n+ roles \n+ channel \n+ punishment\n\`\`\``).setFooter({text: `${prefix}set <automod> <antylink> <usun>`, iconURL: message.author.displayAvatarURL()})]});    
                }
                else if ( forr === 'roles'){
                    client.db.prepare(`UPDATE automod SET antybadwords_role = null WHERE guild_id = ?`).run(message.guild.id)
                    return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]}) 
                }
                else if (forr === 'channel'){
                    client.db.prepare(`UPDATE automod SET antybadwords_channel = null WHERE guild_id = ?`).run(message.guild.id)
                    return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]}) 
                }
                else if (forr === 'punishment'){
                    client.db.prepare(`UPDATE automod SET antybadwords_kara = null WHERE guild_id = ?`).run(message.guild.id)
                    return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]})
                }
            }
        }
    }
}