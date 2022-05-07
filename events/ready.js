const colors = require("colors");
const moment = require('moment-timezone')

exports.run = async (client) => {
//BAZA
    console.log(colors.green(`${client.user.tag} Jestem już`));

    client.db.prepare('CREATE TABLE IF NOT EXISTS gbans (id TEXT, date TEXT, admin TEXT, powod TEXT)').run();

    client.db.prepare('CREATE TABLE IF NOT EXISTS premium (id TEXT, type TEXT)').run();

    client.db.prepare('CREATE TABLE IF NOT EXISTS automod (guild_id TEXT, antylink TEXT, antylink_roles TEXT, antylink_channel TEXT, antylink_kara TEXT, antybadwords TEXT, antybadwords_role TEXT, antybadwords_channel TEXT, antybadwords_kara TEXT, antyping TEXT, antyping_role TEXT, antyping_channel TEXT, antyping_kara TEXT, antyping_ping_member TEXT, antyping_ping_role TEXT)').run();

    client.db.prepare('CREATE TABLE IF NOT EXISTS statystyki (guild_id TEXT, members_id TEXT, members_text TEXT, bots_id TEXT, bots_text TEXT, all_id TEXT, all_text TEXT, bans_id TEXT, bans_text TEXT, bans_ilosc INT, data_text TEXT, data_id TEXT, nowy_id TEXT, nowy_text TEXT, role_id TEXT, role_text TEXT, channel_id TEXT, channel_text TEXT, member_add_id TEXT, member_add_text TEXT, member_add_ilosc INT, role_user_id TEXT, role_user_text TEXT, role_role_id TEXT)').run();

    client.db.prepare('CREATE TABLE IF NOT EXISTS serwer (guild_id TEXT, prefix TEXT, user_role TEXT, mute_role TEXT, channel_logs TEXT, channel_mems TEXT, channel_modlog TEXT, userrole TEXT, autopubliker TEXT)').run();

    client.db.prepare('CREATE TABLE IF NOT EXISTS history (user_id TEXT, guild_id TEXT, mod_id TEXT, action TEXT, reason TEXT, data TEXT)').run();

    client.db.prepare('CREATE TABLE IF NOT EXISTS warns (numer INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, mod_id TEXT, guild_id TEXT, reason TEXT)').run();

    client.db.prepare('CREATE TABLE IF NOT EXISTS member_add (guild_id TEXT, roles_id TEXT, roles_bot_id TEXT, powitanie TEXT, channel_id TEXT, kolor TEXT, text_embeds TEXT, text TEXT, obraz TEXT, tytul TEXT, button TEXT)').run();

    client.db.prepare('CREATE TABLE IF NOT EXISTS member_papa (guild_id TEXT,powitanie TEXT, channel_id TEXT, kolor TEXT, text TEXT, text_embeds TEXT, obraz TEXT, tytul TEXT)').run();

    client.db.prepare('CREATE TABLE IF NOT EXISTS suggestions (guild_id TEXT, channel_suggest TEXT, typ TEXT, roles TEXT, webhook_id EXT, webhook_token TEXT)').run();

    client.db.prepare('CREATE TABLE IF NOT EXISTS wer (guild_id TEXT, roles_id TEXT, channel_id TEXT, channel_log_id TEXT, message_id TEXT, weryfikacja TEXT)').run();

    client.db.prepare('CREATE TABLE IF NOT EXISTS webhook (guild_id TEXT, url TEXT)').run();

    client.db.prepare('CREATE TABLE IF NOT EXISTS leveling (guild_id TEXT, user_id TEXT, level INTEGER, currentXP INTEGER, allXP INTEGER)').run(); 

    client.db.prepare('CREATE TABLE IF NOT EXISTS leveling_settings (guild_id TEXT, onn TEXT, lvlUpChannel TEXT, lvlUpMessage TEXT)').run(); 

    client.db.prepare('CREATE TABLE IF NOT EXISTS leveling_settings_boost (guild_id TEXT, lvlBoostRole TEXT, lvlBoostXP TEXT)').run(); 

    client.db.prepare('CREATE TABLE IF NOT EXISTS top_settings (guild_id TEXT, top_on TEXT, user_delete TEXT, user_id TEXT)').run();

    client.db.prepare('CREATE TABLE IF NOT EXISTS top (guild_id TEXT, user_id TEXT, user_delete_ilosc NUMERIC, ilosc NUMERIC, channel_id TEXT, ilosc_channel NUMERIC, user_global_id TEXT, user_global_ilosc NUMERIC)').run();

    client.db.prepare('CREATE TABLE IF NOT EXISTS testy (guild_id TEXT, test1 TEXT, test2 TEXT, test3 TEXT, test_1 NUMERIC, test_2 NUMERIC)').run();


    console.log(colors.cyan(`\n\nBazy danych załadowana\n`));
//BAZA

//STATUS

    const act = [
        "🔥 Corfi - zweryfikowany bot wielozadaniowy!",
        "🔔 Oznacz mnie: @Corfi",
        `🔗 https://bit.ly/Corfi/`,
        `🔧 Wersja: 4V`,
        `✅ Jestem zweryfikowany`,
        `🐲 Dodaj mnie do siebie!`,
        `🎁 Obsługuję ${client.giveawaysManager.giveaways.filter(element => element.ended === false).length} losowań`

    ];
    setInterval(() => {
        const rdm = Math.floor(Math.random() * (act.length - 1) + 1);
        const newp = act[rdm];

        client.user.setPresence({ activities: [{ name: `${newp}` }]});

    }, 310000);


//STATUS

//YT

//YT

//INNE
    setInterval(function() {
        for(let i = 0; i < client.giveawaysManager.giveaways.filter(element => element.ended === true).length; i++){
            client.giveawaysManager.delete(client.giveawaysManager.giveaways.filter(element => element.ended === true)[i].messageId);
        }

        client.guilds.cache.forEach(guild => {
            client.db.prepare(`UPDATE statystyki SET member_add_ilosc = null WHERE guild_id = ?`).run(guild.id)
        })


    }, 86400000);
//INNE

//STATYSTYKI
setInterval(() => {
    client.guilds.cache.forEach(async guild => {
        if (guild.me.permissions.has("MANAGE_CHANNELS")) {
            const ser = client.db.prepare('SELECT * FROM statystyki WHERE guild_id = ?').get(guild.id);
            if (ser) {
                if (ser?.data_id && ser?.data_id != null) {
                    if (guild.channels.cache.get(ser.data_id)) {
                        const text_pa = ser?.data_text || `📆・Data: {}`
                        const tekst = text_pa.replace(/{}/g, `${moment().tz('Poland').format('DD.MM.YYYY')}`).replace(/{R}/g, `${moment().tz('Poland').format('YYYY')}`).replace(/{M}/g, `${moment().tz('Poland').format('MM')}`).replace(/{D}/g, `${moment().tz('Poland').format('DD')}`)
                        await guild.channels.cache.get(ser.data_id).setName(tekst)
                    }
                }
                if (ser?.bans_id && ser?.bans_id != null) {
                    if (guild.channels.cache.get(ser.bans_id)) {
                        const text_pa = ser?.bans_text || `⛔・Bany: {}`
                        const tekst = text_pa.replace(/{}/g, `${guild.bans.cache.size}`)
                        await guild.channels.cache.get(ser.bans_id).setName(tekst)
                    }
                }
                if (ser?.all_id && ser?.all_id != null) {
                    if (guild.channels.cache.get(ser.all_id)) {
                        const text_pa = ser?.all_text || `🧩・Wszyscy: {}`
                        const tekst = text_pa.replace(/{}/g, `${guild.memberCount}`)
                        await guild.channels.cache.get(ser.all_id).setName(tekst)
                    }
                }
                if (ser?.role_id && ser?.role_id != null) {
                    if (guild.channels.cache.get(ser.role_id)) {
                        const text_pa = ser?.role_text || `📀・Role: {}`
                        const tekst = text_pa.replace(/{}/g, `${guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString()).length}`)
                        await guild.channels.cache.get(ser.role_id).setName(tekst)
                    }
                }
                if (ser?.channel_id && ser?.channel_id != null) {
                    if (guild.channels.cache.get(ser.channel_id)) {
                        const text_pa = ser?.channel_text || `📟・Kanały: {}`
                        const tekst = text_pa.replace(/{}/g, `${guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').size + guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').size}`)
                        await guild.channels.cache.get(ser.channel_id).setName(tekst)
                    }
                }
                if (ser?.member_add_id && ser?.member_add_id != null) {
                    if (guild.channels.cache.get(ser.member_add_id)) {
                        const text_pa = ser?.member_add_text || `🎱・Doszło: {}`
                        const tekst = text_pa.replace(/{}/g, `${ser?.member_add_ilosc || `0`}`)
                        await guild.channels.cache.get(ser.member_add_id).setName(tekst)
                    }
                }
                if (ser?.role_user_id && ser?.role_user_id != null && ser?.role_role_id && ser?.role_role_id != null) {
                    if (guild.channels.cache.get(ser.role_user_id) && guild.roles.cache.get(ser.role_role_id)) {
                        const text_pa = ser?.role_user_text || `🧸・Posiada: {}`
                        const tekst = text_pa.replace(/{}/g, `${guild.roles.cache.get(ser.role_role_id).members.size}`)    
                        await guild.channels.cache.get(ser.role_user_id).setName(tekst) 
                    }
                }
            }
        }
    })
}, 310000);
//STATYSTYKI
}



// Satystyki jak będziemy mieć intent 

    // if (ser?.bots_id && ser?.bots_id != null) {
    //     if (guild.channels.cache.get(ser.bots_id)) {
    //         const text_pa = ser?.bots_text || `🤖・Boty: {}`
    //         const tekst = text_pa.replace(/{}/g, `${guild.members.cache.filter((member) => member.user.bot).size}`)
    //         await guild.channels.cache.get(ser.bots_id).setName(tekst)
    //     }
    // }
    // if (ser?.members_id && ser?.members_id != null ) {
    //     if (guild.channels.cache.get(ser.members_id)) {
    //         let szyscy = guild.memberCount
    //         let boty = guild.members.cache.filter(m => m.user.bot).size
    //         let users = `${szyscy - boty - 1}`
    //         const text_pa = ser?.members_text || `🎈・Wszyscy: {}`
    //         const tekst = text_pa.replace(/{}/g, `${users}`)
    //         await guild.channels.cache.get(ser.members_id).setName(tekst)
    //     }
    // }
// 