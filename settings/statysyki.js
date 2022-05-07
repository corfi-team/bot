const {MessageEmbed} = require('discord.js')
const emotki = require('../base/emotki.json')
module.exports = {
    name: "statistics",
    usage: "statistics <////>",
    async run(message, args) {

        let konf = (args[1])
        let tzy = (args[2])
        let forr = (args.slice(3).join(" "))
        let tery = (args.slice(4).join(" "))

        let baza = client.db.prepare('SELECT prefix FROM serwer WHERE guild_id = ?').get(message.guild.id)
        const prefix = baza?.prefix || "%"

        let channel = message.guild.channels.cache.get(tzy) || message.guild.channels.cache.find((x) => x.name === tzy) || message.mentions.channels.first();
        let roles = message.mentions.roles.first();

        if (!konf) {
            const embed_not = new MessageEmbed()
                .setColor("RED")
                .setDescription(`>>> ${emotki.tak} Wymagane podanie nazwy kategorii: \n\n\`\`\`diff\n+ member\n+ news\n+ date\n+ roles\n+ channels\n+ bans\n+ member_add\n+ role_user \n\n- delete\`\`\``)
                .setFooter({text: `${prefix}set <statistics> <wartość>`, iconURL: message.author.displayAvatarURL()})
            return message.reply({embeds: [embed_not]})
        }
        else if (konf === 'member') {
            if (!tzy) {
                const embed_not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`>>> ${emotki.not} Źle użyłeś komendy, oto przykład: \n\n\`\`\`diff\n+ ${prefix}set statistics member #member 🧩・Wszyscy: {}\n+ ${prefix}set statistics member member 🧩・Wszyscy: {}\n+ ${prefix}set statistics member 899289308865900554 🧩・Wszyscy: {}\`\`\``)
                    .setFooter({text: `${prefix}set <statistics> <member> <channel>`, iconURL: message.author.displayAvatarURL()})
                return message.reply({embeds: [embed_not]})
            }
            else if (!channel) {
                const embed_not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`>>> ${emotki.not} Nie podałeś kanału: \n\n\`\`\`diff\n+ ${prefix}set statistics member #member 🧩・Wszyscy: {}\n+ ${prefix}set statistics member member 🧩・Wszyscy: {}\n+ ${prefix}set statistics member 899289308865900554 🧩・Wszyscy: {}\n\n- Jeśli nie podasz tekstu ani {} bot zrobi za ciebie!\`\`\``)
                    .setFooter({text: `${prefix}set <statistics> <member> <channel>`, iconURL: message.author.displayAvatarURL()})
                return message.reply({embeds: [embed_not]})
            }
            else if (channel.guild.id !== message.guild.id) {
                const embed_not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`>>> ${emotki.not} Nie podałeś kanału na tym serwerze: \n\n\`\`\`diff\n+ ${prefix}set statistics member #member 🧩・Wszyscy: {}\n+ ${prefix}set statistics member member 🧩・Wszyscy: {}\n+ ${prefix}set statistics member 899289308865900554 🧩・Wszyscy: {}\n\n- Jeśli nie podasz tekstu ani {} bot zrobi za ciebie!\`\`\``)
                    .setFooter({text: `${prefix}set <statistics> <member> <channel>`, iconURL: message.author.displayAvatarURL()})
                return message.reply({embeds: [embed_not]})
            }
            else if (channel.type != 'GUILD_VOICE') {
                const embed_not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`>>> ${emotki.not} Kanał musi być kanałem gosowym: \n\n\`\`\`diff\n+ ${prefix}set statistics member #member 🧩・Wszyscy: {}\n+ ${prefix}set statistics member member 🧩・Wszyscy: {}\n+ ${prefix}set statistics member 899289308865900554 🧩・Wszyscy: {}\n\n- Jeśli nie podasz tekstu ani {} bot zrobi za ciebie!\`\`\``)
                    .setFooter({text: `${prefix}set <statistics> <member> <channel>`, iconURL: message.author.displayAvatarURL()})
                return message.reply({embeds: [embed_not]})
            }
            else if (forr && forr.length > 25 ) {
                const embed_not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`>>> ${emotki.not} Maksymalnie może być 25 znaków: \n\n\`\`\`diff\n+ ${prefix}set statistics member #member 🧩・Wszyscy: {}\n+ ${prefix}set statistics member member 🧩・Wszyscy: {}\n+ ${prefix}set statistics member 899289308865900554 🧩・Wszyscy: {}\n\n- Jeśli nie podasz tekstu ani {} bot zrobi za ciebie!\`\`\``)
                    .setFooter({text: `${prefix}set <statistics> <member> <channel>`, iconURL: message.author.displayAvatarURL()})
                return message.reply({embeds: [embed_not]})
            }
            else {

                const i = client.db.prepare('SELECT all_id FROM statystyki WHERE guild_id = ?').get(message.guild.id);
                if(i){
                    client.db.prepare(`UPDATE statystyki SET all_id = ? WHERE guild_id = ?`).run(channel.id, message.guild.id)
                }else{
                    client.db.prepare(`INSERT INTO statystyki(guild_id, all_id) VALUES(?,?)`).run(message.guild.id, channel.id);
                }

                const ser = client.db.prepare('SELECT all_text FROM statystyki WHERE guild_id = ?').get(message.guild.id);
                if(ser){
                    client.db.prepare(`UPDATE statystyki SET all_text = ? WHERE guild_id = ?`).run(forr || null, message.guild.id)
                }else{
                    client.db.prepare(`INSERT INTO statystyki(guild_id, all_text) VALUES(?,?)`).run(message.guild.id, forr || null);
                }

                return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} \`Ustawiono kanał statystyk na:\` ${channel}`)]})

            }
        }

        else if (konf === 'news') {
            if (!tzy) {
                const embed_not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`>>> ${emotki.not} Źle użyłeś komendy, oto przykład: \n\n\`\`\`diff\n+ ${prefix}set statistics news #news 👋・Nowy: {}\n+ ${prefix}set statistics news news 👋・Nowy: {}\n+ ${prefix}set statistics news 899289308865900554 👋・Nowy: {}\`\`\``)
                    .setFooter({text: `${prefix}set <statistics> <news> <channel>`, iconURL: message.author.displayAvatarURL()})
                return message.reply({embeds: [embed_not]})
            }
            else if (!channel) {
                const embed_not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`>>> ${emotki.not} Nie podałeś kanału: \n\n\`\`\`diff\n+ ${prefix}set statistics news #news 👋・Nowy: {}\n+ ${prefix}set statistics news news 👋・Nowy: {}\n+ ${prefix}set statistics news 899289308865900554 👋・Nowy: {}\`\`\``)
                    .setFooter({text: `${prefix}set <statistics> <news> <channel>`, iconURL: message.author.displayAvatarURL()})
                return message.reply({embeds: [embed_not]})
            }
            else if (channel.guild.id !== message.guild.id) {
                const embed_not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`>>> ${emotki.not} Nie podałeś kanału na tym serwerze: \n\n\`\`\`diff\n+ ${prefix}set statistics news #news 👋・Nowy: {}\n+ ${prefix}set statistics news news 👋・Nowy: {}\n+ ${prefix}set statistics news 899289308865900554 👋・Nowy: {}\`\`\``)
                    .setFooter({text: `${prefix}set <statistics> <news> <channel>`, iconURL: message.author.displayAvatarURL()})
                return message.reply({embeds: [embed_not]})
            }
            else if (channel.type != 'GUILD_VOICE') {
                const embed_not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`>>> ${emotki.not} Kanał musi być kanałem głosowym: \n\n\`\`\`diff\n+ ${prefix}set statistics news #news 👋・Nowy: {}\n+ ${prefix}set statistics news news 👋・Nowy: {}\n+ ${prefix}set statistics news 899289308865900554 👋・Nowy: {}\`\`\``)
                    .setFooter({text: `${prefix}set <statistics> <news> <channel>`, iconURL: message.author.displayAvatarURL()})
                return message.reply({embeds: [embed_not]})
            }
            else if (forr && forr.length > 25 ) {
                const embed_not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`>>> ${emotki.not} Maksymalnie może być 25 znaków: \n\n\`\`\`diff\n+ ${prefix}set statistics news #news 👋・Nowy: {}\n+ ${prefix}set statistics news news 👋・Nowy: {}\n+ ${prefix}set statistics news 899289308865900554 👋・Nowy: {}\`\`\``)
                    .setFooter({text: `${prefix}set <statistics> <news> <channel>`, iconURL: message.author.displayAvatarURL()})
                return message.reply({embeds: [embed_not]})
            }
            else {

                const i = client.db.prepare('SELECT nowy_id FROM statystyki WHERE guild_id = ?').get(message.guild.id);
                if(i){
                    client.db.prepare(`UPDATE statystyki SET nowy_id = ? WHERE guild_id = ?`).run(channel.id, message.guild.id)
                }else{
                    client.db.prepare(`INSERT INTO statystyki(guild_id, nowy_id) VALUES(?,?)`).run(message.guild.id, channel.id);
                }

                const ser = client.db.prepare('SELECT nowy_text FROM statystyki WHERE guild_id = ?').get(message.guild.id);
                if(ser){
                    client.db.prepare(`UPDATE statystyki SET nowy_text = ? WHERE guild_id = ?`).run(forr || null, message.guild.id)
                }else{
                    client.db.prepare(`INSERT INTO statystyki(guild_id, nowy_text) VALUES(?,?)`).run(message.guild.id, forr || null);
                }

                return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} \`Ustawiono kanał statystyk na:\` ${channel}`)]})

            }
        }

        else if (konf === 'date') {
            if (!tzy) {
                const embed_not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`>>> ${emotki.not} Źle użyłeś komendy, oto przykład: \n\n\`\`\`diff\n+ ${prefix}set statistics date #date 📆・Data: {}\n+ ${prefix}set statistics date date 📆・Data: {}\n+ ${prefix}set statistics date 899289308865900554 📆・Data: {}\n\n+ 📆・Data: {R} ===> Rok\n+ 📆・Data: {M} ===> Miesiąc\n+ 📆・Data: {D} ===> Dzień\n+ 📆・Data: {} ===> Dzień.Miesiąc.Rok\`\`\``)
                    .setFooter({text: `${prefix}set <statistics> <date> <channel>`, iconURL: message.author.displayAvatarURL()})
                return message.reply({embeds: [embed_not]})
            }
            else if (!channel) {
                const embed_not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`>>> ${emotki.not} Nie podałeś kanału: \n\n\`\`\`diff\n+ ${prefix}set statistics date #date 📆・Data: {}\n+ ${prefix}set statistics date date 📆・Data: {}\n+ ${prefix}set statistics date 899289308865900554 📆・Data: {}\n\n+ 📆・Data: {R} ===> Rok\n+ 📆・Data: {M} ===> Miesiąc\n+ 📆・Data: {D} ===> Dzień\n+ 📆・Data: {} ===> Dzień.Miesiąc.Rok\`\`\``)
                    .setFooter({text: `${prefix}set <statistics> <date> <channel>`, iconURL: message.author.displayAvatarURL()})
                return message.reply({embeds: [embed_not]})
            }
            else if (channel.guild.id !== message.guild.id) {
                const embed_not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`>>> ${emotki.not} Nie podałeś kanału na tym serwerze: \n\n\`\`\`diff\n+ ${prefix}set statistics date #date 📆・Data: {}\n+ ${prefix}set statistics date date 📆・Data: {}\n+ ${prefix}set statistics date 899289308865900554 📆・Data: {}\n\n+ 📆・Data: {R} ===> Rok\n+ 📆・Data: {M} ===> Miesiąc\n+ 📆・Data: {D} ===> Dzień\n+ 📆・Data: {} ===> Dzień.Miesiąc.Rok\`\`\``)
                    .setFooter({text: `${prefix}set <statistics> <date> <channel>`, iconURL: message.author.displayAvatarURL()})
                return message.reply({embeds: [embed_not]})
            }
            else if (channel.type != 'GUILD_VOICE') {
                const embed_not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`>>> ${emotki.not} Kanał musi być kanałem głosowym: \n\n\`\`\`diff\n+ ${prefix}set statistics date #date 📆・Data: {}\n+ ${prefix}set statistics date date 📆・Data: {}\n+ ${prefix}set statistics date 899289308865900554 📆・Data: {}\n\n+ 📆・Data: {R} ===> Rok\n+ 📆・Data: {M} ===> Miesiąc\n+ 📆・Data: {D} ===> Dzień\n+ 📆・Data: {} ===> Dzień.Miesiąc.Rok\`\`\``)
                    .setFooter({text: `${prefix}set <statistics> <date> <channel>`, iconURL: message.author.displayAvatarURL()})
                return message.reply({embeds: [embed_not]})
            }
            else if (forr && forr.length > 25 ) {
                const embed_not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`>>> ${emotki.not} Maksymalnie może być 25 znaków: \n\n\`\`\`diff\n+ ${prefix}set statistics date #date 📆・Data: {}\n+ ${prefix}set statistics date date 📆・Data: {}\n+ ${prefix}set statistics date 899289308865900554 📆・Data: {}\n\n+ 📆・Data: {R} ===> Rok\n+ 📆・Data: {M} ===> Miesiąc\n+ 📆・Data: {D} ===> Dzień\n+ 📆・Data: {} ===> Dzień.Miesiąc.Rok\`\`\``)
                    .setFooter({text: `${prefix}set <statistics> <date> <channel>`, iconURL: message.author.displayAvatarURL()})
                return message.reply({embeds: [embed_not]})
            }
            else {

                const i = client.db.prepare('SELECT data_id FROM statystyki WHERE guild_id = ?').get(message.guild.id);
                if(i){
                    client.db.prepare(`UPDATE statystyki SET data_id = ? WHERE guild_id = ?`).run(channel.id, message.guild.id)
                }else{
                    client.db.prepare(`INSERT INTO statystyki(guild_id, data_id) VALUES(?,?)`).run(message.guild.id, channel.id);
                }

                const ser = client.db.prepare('SELECT data_text FROM statystyki WHERE guild_id = ?').get(message.guild.id);
                if(ser){
                    client.db.prepare(`UPDATE statystyki SET data_text = ? WHERE guild_id = ?`).run(forr || null, message.guild.id)
                }else{
                    client.db.prepare(`INSERT INTO statystyki(guild_id, data_text) VALUES(?,?)`).run(message.guild.id, forr || null);
                }
                return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} \`Ustawiono kanał statystyk na:\` ${channel}`)]})
            }
            

        }

        else if (konf === 'roles') {
            if (!tzy) {
                const embed_not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`>>> ${emotki.not} Źle użyłeś komendy, oto przykład: 
                    \n\n\`\`\`diff\n+ ${prefix}set statistics roles #roles 📀・Role: {}\n+ ${prefix}set statistics roles roles 📀・Role: {}\n+ ${prefix}set statistics roles 899289308865900554 📀・Role: {}\`\`\``)
                    .setFooter({text: `${prefix}set <statistics> <roles> <channel>`, iconURL: message.author.displayAvatarURL()})
                return message.reply({embeds: [embed_not]})
            }
            else if (!channel) {
                const embed_not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`>>> ${emotki.not} Nie podałeś kanału: \n\n\`\`\`diff\n+ ${prefix}set statistics roles #roles 📀・Role: {}\n+ ${prefix}set statistics roles roles 📀・Role: {}\n+ ${prefix}set statistics roles 899289308865900554 📀・Role: {}\`\`\``)
                    .setFooter({text: `${prefix}set <statistics> <roles> <channel>`, iconURL: message.author.displayAvatarURL()})
                return message.reply({embeds: [embed_not]})
            }
            else if (channel.guild.id !== message.guild.id) {
                const embed_not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`>>> ${emotki.not} Nie podałeś kanału na tym serwerze: \n\n\`\`\`diff\n+ ${prefix}set statistics roles #roles 📀・Role: {}\n+ ${prefix}set statistics roles roles 📀・Role: {}\n+ ${prefix}set statistics roles 899289308865900554 📀・Role: {}\`\`\``)
                    .setFooter({text: `${prefix}set <statistics> <roles> <channel>`, iconURL: message.author.displayAvatarURL()})
                return message.reply({embeds: [embed_not]})
            }
            else if (channel.type != 'GUILD_VOICE') {
                const embed_not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`>>> ${emotki.not} Kanał musi być kanałem gosowym: \n\n\`\`\`diff\n+ ${prefix}set statistics roles #roles 📀・Role: {}\n+ ${prefix}set statistics roles roles 📀・Role: {}\n+ ${prefix}set statistics roles 899289308865900554 📀・Role: {}\`\`\``)
                    .setFooter({text: `${prefix}set <statistics> <roles> <channel>`, iconURL: message.author.displayAvatarURL()})
                return message.reply({embeds: [embed_not]})
            }
            else if (forr && forr.length > 25 ) {
                const embed_not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`>>> ${emotki.not} Maksymalnie może być 25 znaków: \n\n\`\`\`diff\n+ ${prefix}set statistics roles #roles 📀・Role: {}\n+ ${prefix}set statistics roles roles 📀・Role: {}\n+ ${prefix}set statistics roles 899289308865900554 📀・Role: {}\`\`\``)
                    .setFooter({text: `${prefix}set <statistics> <roles> <channel>`, iconURL: message.author.displayAvatarURL()})
                return message.reply({embeds: [embed_not]})
            }
            else {

                const i = client.db.prepare('SELECT role_id FROM statystyki WHERE guild_id = ?').get(message.guild.id);
                if(i){
                    client.db.prepare(`UPDATE statystyki SET role_id = ? WHERE guild_id = ?`).run(channel.id, message.guild.id)
                }else{
                    client.db.prepare(`INSERT INTO statystyki(guild_id, role_id) VALUES(?,?)`).run(message.guild.id, channel.id);
                }

                const ser = client.db.prepare('SELECT role_text FROM statystyki WHERE guild_id = ?').get(message.guild.id);
                if(ser){
                    client.db.prepare(`UPDATE statystyki SET role_text = ? WHERE guild_id = ?`).run(forr || null, message.guild.id)
                }else{
                    client.db.prepare(`INSERT INTO statystyki(guild_id, role_text) VALUES(?,?)`).run(message.guild.id, forr || null);
                }

                return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} \`Ustawiono kanał statystyk na:\` ${channel}`)]})

            }
        }

        else if (konf === 'channels') {
            if (!tzy) {
                const embed_not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`>>> ${emotki.not} Źle użyłeś komendy, oto przykład: \n\n\`\`\`diff\n+ ${prefix}set statistics channels #channels 📟・Kanały: {}\n+ ${prefix}set statistics channels channels 📟・Kanały: {}\n+ ${prefix}set statistics channels 899289308865900554 📟・Kanały: {}\`\`\``)
                    .setFooter({text: `${prefix}set <statistics> <channels> <channel>`, iconURL: message.author.displayAvatarURL()})
                return message.reply({embeds: [embed_not]})
            }
            else if (!channel) {
                const embed_not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`>>> ${emotki.not} Nie podałeś kanału: \n\n\`\`\`diff\n+ ${prefix}set statistics channels #channels 📟・Kanały: {}\n+ ${prefix}set statistics channels channels 📟・Kanały: {}\n+ ${prefix}set statistics channels 899289308865900554 📟・Kanały: {}\`\`\``)
                    .setFooter({text: `${prefix}set <statistics> <channels> <channel>`, iconURL: message.author.displayAvatarURL()})
                return message.reply({embeds: [embed_not]})
            }
            else if (channel.guild.id !== message.guild.id) {
                const embed_not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`>>> ${emotki.not} Nie podałeś kanału na tym serwerze: \n\n\`\`\`diff\n+ ${prefix}set statistics channels #channels 📟・Kanały: {}\n+ ${prefix}set statistics channels channels 📟・Kanały: {}\n+ ${prefix}set statistics channels 899289308865900554 📟・Kanały: {}\`\`\``)
                    .setFooter({text: `${prefix}set <statistics> <channels> <channel>`, iconURL: message.author.displayAvatarURL()})
                return message.reply({embeds: [embed_not]})
            }
            else if (channel.type != 'GUILD_VOICE') {
                const embed_not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`>>> ${emotki.not} Kanał musi być kanałem gosowym: \n\n\`\`\`diff\n+ ${prefix}set statistics channels #channels 📟・Kanały: {}\n+ ${prefix}set statistics channels channels 📟・Kanały: {}\n+ ${prefix}set statistics channels 899289308865900554 📟・Kanały: {}\`\`\``)
                    .setFooter({text: `${prefix}set <statistics> <channels> <channel>`, iconURL: message.author.displayAvatarURL()})
                return message.reply({embeds: [embed_not]})
            }
            else if (forr && forr.length > 25 ) {
                const embed_not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`>>> ${emotki.not} Maksymalnie może być 25 znaków: \n\n\`\`\`diff\n+ ${prefix}set statistics channels #channels 📟・Kanały: {}\n+ ${prefix}set statistics channels channels 📟・Kanały: {}\n+ ${prefix}set statistics channels 899289308865900554 📟・Kanały: {}\`\`\``)
                    .setFooter({text: `${prefix}set <statistics> <channels> <channel>`, iconURL: message.author.displayAvatarURL()})
                return message.reply({embeds: [embed_not]})
            }
            else {

                const i = client.db.prepare('SELECT channel_id FROM statystyki WHERE guild_id = ?').get(message.guild.id);
                if(i){
                    client.db.prepare(`UPDATE statystyki SET channel_id = ? WHERE guild_id = ?`).run(channel.id, message.guild.id)
                }else{
                    client.db.prepare(`INSERT INTO statystyki(guild_id, channel_id) VALUES(?,?)`).run(message.guild.id, channel.id);
                }

                const ser = client.db.prepare('SELECT channel_text FROM statystyki WHERE guild_id = ?').get(message.guild.id);
                if(ser){
                    client.db.prepare(`UPDATE statystyki SET channel_text = ? WHERE guild_id = ?`).run(forr || null, message.guild.id)
                }else{
                    client.db.prepare(`INSERT INTO statystyki(guild_id, channel_text) VALUES(?,?)`).run(message.guild.id, forr || null);
                }

                return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} \`Ustawiono kanał statystyk na:\` ${channel}`)]})

            }
        }

        else if (konf === 'bans') {
            if (!tzy) {
                const embed_not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`>>> ${emotki.not} Źle użyłeś komendy, oto przykład
                     \n\n\`\`\`diff\n+ ${prefix}set statistics bans #bans ⛔・Bany: {}\n+ ${prefix}set statistics bans bans ⛔・Bany: {}\n+ ${prefix}set statistics bans 899289308865900554 ⛔・Bany: {}\`\`\``)
                    .setFooter({text: `${prefix}set <statistics> <bans> <channel>`, iconURL: message.author.displayAvatarURL()})
                return message.reply({embeds: [embed_not]})
            }
            else if (!channel) {
                const embed_not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`>>> ${emotki.not} Nie podałeś kanału: \n\n\`\`\`diff\n+ ${prefix}set statistics bans #bans ⛔・Bany: {}\n+ ${prefix}set statistics bans bans ⛔・Bany: {}\n+ ${prefix}set statistics bans 899289308865900554 ⛔・Bany: {}\`\`\``)
                    .setFooter({text: `${prefix}set <statistics> <bans> <channel>`, iconURL: message.author.displayAvatarURL()})
                return message.reply({embeds: [embed_not]})
            }
            else if (channel.guild.id !== message.guild.id) {
                const embed_not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`>>> ${emotki.not} Nie podałeś kanału na tym serwerze: \n\n\`\`\`diff\n+ ${prefix}set statistics bans #bans ⛔・Bany: {}\n+ ${prefix}set statistics bans bans ⛔・Bany: {}\n+ ${prefix}set statistics bans 899289308865900554 ⛔・Bany: {}\`\`\``)
                    .setFooter({text: `${prefix}set <statistics> <bans> <channel>`, iconURL: message.author.displayAvatarURL()})
                return message.reply({embeds: [embed_not]})
            }
            else if (channel.type != 'GUILD_VOICE') {
                const embed_not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`>>> ${emotki.not} Kanał musi być kanałem gosowym: \n\n\`\`\`diff\n+ ${prefix}set statistics bans #bans ⛔・Bany: {}\n+ ${prefix}set statistics bans bans ⛔・Bany: {}\n+ ${prefix}set statistics bans 899289308865900554 ⛔・Bany: {}\`\`\``)
                    .setFooter({text: `${prefix}set <statistics> <bans> <channel>`, iconURL: message.author.displayAvatarURL()})
                return message.reply({embeds: [embed_not]})
            }
            else if (forr && forr.length > 25 ) {
                const embed_not = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`>>> ${emotki.not} Maksymalnie może być 25 znaków: \n\n\`\`\`diff\n+ ${prefix}set statistics bans #bans ⛔・Bany: {}\n+ ${prefix}set statistics bans bans ⛔・Bany: {}\n+ ${prefix}set statistics bans 899289308865900554 ⛔・Bany: {}\`\`\``)
                    .setFooter({text: `${prefix}set <statistics> <bans> <channel>`, iconURL: message.author.displayAvatarURL()})
                return message.reply({embeds: [embed_not]})
            }
            else {

                const i = client.db.prepare('SELECT bans_id FROM statystyki WHERE guild_id = ?').get(message.guild.id);
                if(i){
                    client.db.prepare(`UPDATE statystyki SET bans_id = ? WHERE guild_id = ?`).run(channel.id, message.guild.id)
                }else{
                    client.db.prepare(`INSERT INTO statystyki(guild_id, bans_id) VALUES(?,?)`).run(message.guild.id, channel.id);
                }

                const ser = client.db.prepare('SELECT bans_text FROM statystyki WHERE guild_id = ?').get(message.guild.id);
                if(ser){
                    client.db.prepare(`UPDATE statystyki SET bans_text = ? WHERE guild_id = ?`).run(forr || null, message.guild.id)
                }else{
                    client.db.prepare(`INSERT INTO statystyki(guild_id, bans_text) VALUES(?,?)`).run(message.guild.id, forr || null);
                }

                return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} \`Ustawiono kanał statystyk na:\` ${channel}`)]})

            }
        }

        else if (konf === 'member_add') {
            if (!client.db.prepare('SELECT * FROM premium WHERE id = ?').get(message.guild.id) && !client.db.prepare('SELECT * FROM premium WHERE id = ?').get(message.author.id)) {
                const error = new MessageEmbed()
                    .setColor("RED")
                    .setAuthor({name: `${message.author.username} premium!`, iconURL: `${message.author.displayAvatarURL({})}`})
                    .setDescription(`>>> \`\`\`diff\n- Ta konfiguracja wymaga posiadania premium! \n\`\`\``)
                return message.reply({embeds: [error]})
            }
            else if (client.db.prepare('SELECT * FROM premium WHERE id = ?').get(message.guild.id) && client.db.prepare('SELECT * FROM premium WHERE id = ?').get(message.author.id)) {
                if (!tzy) {
                    const embed_not = new MessageEmbed()
                        .setColor("RED")
                        .setDescription(`>>> ${emotki.not} Źle użyłeś komendy, oto przykład
                         \n\n\`\`\`diff\n+ ${prefix}set statistics member_add #member_add 🎱・Doszło: {}\n+ ${prefix}set statistics member_add member_add 🎱・Doszło: {}\n+ ${prefix}set statistics member_add 899289308865900554 🎱・Doszło: {}\`\`\``)
                        .setFooter({text: `${prefix}set <statistics> <member_add> <channel>`, iconURL: message.author.displayAvatarURL()})
                    return message.reply({embeds: [embed_not]})
                }
                else if (!channel) {
                    const embed_not = new MessageEmbed()
                        .setColor("RED")
                        .setDescription(`>>> ${emotki.not} Nie podałeś kanału: \n\n\`\`\`diff\n+ ${prefix}set statistics member_add #member_add 🎱・Doszło: {}\n+ ${prefix}set statistics member_add member_add 🎱・Doszło: {}\n+ ${prefix}set statistics member_add 899289308865900554 🎱・Doszło: {}\`\`\``)
                        .setFooter({text: `${prefix}set <statistics> <member_add> <channel>`, iconURL: message.author.displayAvatarURL()})
                    return message.reply({embeds: [embed_not]})
                }
                else if (channel.guild.id !== message.guild.id) {
                    const embed_not = new MessageEmbed()
                        .setColor("RED")
                        .setDescription(`>>> ${emotki.not} Nie podałeś kanału na tym serwerze: \n\n\`\`\`diff\n+ ${prefix}set statistics member_add #member_add 🎱・Doszło: {}\n+ ${prefix}set statistics member_add member_add 🎱・Doszło: {}\n+ ${prefix}set statistics member_add 899289308865900554 🎱・Doszło: {}\`\`\``)
                        .setFooter({text: `${prefix}set <statistics> <member_add> <channel>`, iconURL: message.author.displayAvatarURL()})
                    return message.reply({embeds: [embed_not]})
                }
                else if (channel.type != 'GUILD_VOICE') {
                    const embed_not = new MessageEmbed()
                        .setColor("RED")
                        .setDescription(`>>> ${emotki.not} Kanał musi być kanałem gosowym: \n\n\`\`\`diff\n+ ${prefix}set statistics member_add #member_add 🎱・Doszło: {}\n+ ${prefix}set statistics member_add member_add 🎱・Doszło: {}\n+ ${prefix}set statistics member_add 899289308865900554 🎱・Doszło: {}\`\`\``)
                        .setFooter({text: `${prefix}set <statistics> <member_add> <channel>`, iconURL: message.author.displayAvatarURL()})
                    return message.reply({embeds: [embed_not]})
                }
                else if (forr && forr.length > 25 ) {
                    const embed_not = new MessageEmbed()
                        .setColor("RED")
                        .setDescription(`>>> ${emotki.not} Maksymalnie może być 25 znaków: \n\n\`\`\`diff\n+ ${prefix}set statistics member_add #member_add 🎱・Doszło: {}\n+ ${prefix}set statistics member_add member_add 🎱・Doszło: {}\n+ ${prefix}set statistics member_add 899289308865900554 🎱・Doszło: {}\`\`\``)
                        .setFooter({text: `${prefix}set <statistics> <member_add> <channel>`, iconURL: message.author.displayAvatarURL()})
                    return message.reply({embeds: [embed_not]})
                }
                else {
    
                    const i = client.db.prepare('SELECT member_add_id FROM statystyki WHERE guild_id = ?').get(message.guild.id);
                    if(i){
                        client.db.prepare(`UPDATE statystyki SET member_add_id = ? WHERE guild_id = ?`).run(channel.id, message.guild.id)
                    }else{
                        client.db.prepare(`INSERT INTO statystyki(guild_id, member_add_id) VALUES(?,?)`).run(message.guild.id, channel.id);
                    }
    
                    const ser = client.db.prepare('SELECT member_add_text FROM statystyki WHERE guild_id = ?').get(message.guild.id);
                    if(ser){
                        client.db.prepare(`UPDATE statystyki SET member_add_text = ? WHERE guild_id = ?`).run(forr || null, message.guild.id)
                    }else{
                        client.db.prepare(`INSERT INTO statystyki(guild_id, member_add_text) VALUES(?,?)`).run(message.guild.id, forr || null);
                    }
    
                    return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} \`Ustawiono kanał statystyk na:\` ${channel}`)]})
    
                }
            }
        }

        else if (konf === 'role_user') {
            if (!client.db.prepare('SELECT * FROM premium WHERE id = ?').get(message.guild.id) && !client.db.prepare('SELECT * FROM premium WHERE id = ?').get(message.author.id)) {
                const error = new MessageEmbed()
                    .setColor("RED")
                    .setAuthor({name: `${message.author.username} premium!`, iconURL: `${message.author.displayAvatarURL({})}`})
                    .setDescription(`>>> \`\`\`diff\n- Ta konfiguracja wymaga posiadania premium! \n\`\`\``)
                return message.reply({embeds: [error]})
            }
            else {
                if (!tzy) {
                    const embed_not = new MessageEmbed()
                        .setColor("RED")
                        .setDescription(`>>> ${emotki.not} Źle użyłeś komendy, oto przykład \n\n\`\`\`diff\n+ ${prefix}set statistics role_user #role_user @roles 🧸・Posiada: {}\n+ ${prefix}set statistics role_user role_user @roles 🧸・Posiada: {}\n+ ${prefix}set statistics role_user 899289308865900554 @roles 🧸・Posiada: {}\`\`\``)
                        .setFooter({text: `${prefix}set <statistics> <role_user> <channel>`, iconURL: message.author.displayAvatarURL()})
                    return message.reply({embeds: [embed_not]})
                }
                else if (!channel) {
                    const embed_not = new MessageEmbed()
                        .setColor("RED")
                        .setDescription(`>>> ${emotki.not} Nie podałeś kanału:
                         \n\n\`\`\`diff\n+ ${prefix}set statistics role_user #role_user @roles 🧸・Posiada: {}\n+ ${prefix}set statistics role_user role_user @roles 🧸・Posiada: {}\n+ ${prefix}set statistics role_user 899289308865900554 @roles 🧸・Posiada: {}\`\`\``)
                        .setFooter({text: `${prefix}set <statistics> <role_user> <channel>`, iconURL: message.author.displayAvatarURL()})
                    return message.reply({embeds: [embed_not]})
                }
                else if (!roles) {
                    const embed_not = new MessageEmbed()
                        .setColor("RED")
                        .setDescription(`>>> ${emotki.not} Nie podałeś roli:
                         \n\n\`\`\`diff\n+ ${prefix}set statistics role_user #role_user @roles 🧸・Posiada: {}\n+ ${prefix}set statistics role_user role_user @roles 🧸・Posiada: {}\n+ ${prefix}set statistics role_user 899289308865900554 @roles 🧸・Posiada: {}\`\`\``)
                        .setFooter({text: `${prefix}set <statistics> <role_user> <channel>`, iconURL: message.author.displayAvatarURL()})
                    return message.reply({embeds: [embed_not]})
                }
                else if (channel.guild.id !== message.guild.id) {
                    const embed_not = new MessageEmbed()
                        .setColor("RED")
                        .setDescription(`>>> ${emotki.not} Nie podałeś kanału na tym serwerze: \n\n\`\`\`diff\n+ ${prefix}set statistics role_user #role_user @roles 🧸・Posiada: {}\n+ ${prefix}set statistics role_user role_user @roles 🧸・Posiada: {}\n+ ${prefix}set statistics role_user 899289308865900554 @roles 🧸・Posiada: {}\`\`\``)
                        .setFooter({text: `${prefix}set <statistics> <role_user> <channel>`, iconURL: message.author.displayAvatarURL()})
                    return message.reply({embeds: [embed_not]})
                }
                else if (channel.type != 'GUILD_VOICE') {
                    const embed_not = new MessageEmbed()
                        .setColor("RED")
                        .setDescription(`>>> ${emotki.not} Kanał musi być kanałem gosowym: \n\n\`\`\`diff\n+ ${prefix}set statistics role_user #role_user @roles 🧸・Posiada: {}\n+ ${prefix}set statistics role_user role_user @roles 🧸・Posiada: {}\n+ ${prefix}set statistics role_user 899289308865900554 @roles 🧸・Posiada: {}\`\`\``)
                        .setFooter({text: `${prefix}set <statistics> <role_user> <channel>`, iconURL: message.author.displayAvatarURL()})
                    return message.reply({embeds: [embed_not]})
                }
                else if (tery && tery.length > 26 ) {
                    const embed_not = new MessageEmbed()
                        .setColor("RED")
                        .setDescription(`>>> ${emotki.not} Maksymalnie może być 25 znaków: \n\n\`\`\`diff\n+ ${prefix}set statistics role_user #role_user @roles 🧸・Posiada: {}\n+ ${prefix}set statistics role_user role_user @roles 🧸・Posiada: {}\n+ ${prefix}set statistics role_user 899289308865900554 @roles 🧸・Posiada: {}\`\`\``)
                        .setFooter({text: `${prefix}set <statistics> <role_user> <channel>`, iconURL: message.author.displayAvatarURL()})
                    return message.reply({embeds: [embed_not]})
                }
                else {
    
                    const i = client.db.prepare('SELECT role_user_id FROM statystyki WHERE guild_id = ?').get(message.guild.id);
                    if(i){
                        client.db.prepare(`UPDATE statystyki SET role_user_id = ? WHERE guild_id = ?`).run(channel.id, message.guild.id)
                    }else{
                        client.db.prepare(`INSERT INTO statystyki(guild_id, role_user_id) VALUES(?,?)`).run(message.guild.id, channel.id);
                    }
    
                    const ser = client.db.prepare('SELECT role_user_text FROM statystyki WHERE guild_id = ?').get(message.guild.id);
                    if(ser){
                        client.db.prepare(`UPDATE statystyki SET role_user_text = ? WHERE guild_id = ?`).run(tery || null, message.guild.id)
                    }else{
                        client.db.prepare(`INSERT INTO statystyki(guild_id, role_user_text) VALUES(?,?)`).run(message.guild.id, tery || null);
                    }
    
                    return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} \`Ustawiono kanał statystyk na:\` ${channel}`)]})
    
                }
            }
        }
    }
}