const {MessageEmbed} = require('discord.js')
const emotki = require('../base/emotki.json')
module.exports = {
    name: "leveling",
    usage: "leveling  <on/off>",
    async run(message, args) {

        switch(args[1]){

            case 'on':
            case 'włącz': {
                message.reply({ embeds : [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.yes} Levele zostały włączone!`).setFooter({text: `${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]})
                
                let o = client.db.prepare('SELECT onn FROM leveling_settings WHERE guild_id = ?').get(message.guild.id)
                if (o) {
                    return client.db.prepare('UPDATE leveling_settings SET onn = ? WHERE guild_id = ?').run('on', message.guild.id)
                } else {
                    return client.db.prepare(`INSERT INTO leveling_settings(guild_id, onn) VALUES(?,?)`).run(message.guild.id, 'on')
                }
            }

            case 'off':
            case 'wyłącz': {
                message.reply({ embeds : [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.yes} Levele zostały wyłączone!`).setFooter({text: `${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]})
                
                let o = client.db.prepare('SELECT onn FROM leveling_settings WHERE guild_id = ?').get(message.guild.id)
                if (o) {
                    return client.db.prepare('UPDATE leveling_settings SET onn = ? WHERE guild_id = ?').run('off', message.guild.id)
                } else {
                    return client.db.prepare(`INSERT INTO leveling_settings(guild_id, onn) VALUES(?,?)`).run(message.guild.id, 'off')
                }
            }

            case 'lvlUpChannel': {
                let men_kan = message.mentions.channels.first();
                if (!men_kan || men_kan.guild.id !== message.guild.id || !message.guild.channels.cache.find(c => c.id === men_kan.id) && men_kan.type == "GUILD_TEXT") return message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Podano nieodpowiedni kanał powiadomienia o nowym levelu!`)]})

                else {
                    message.reply({ embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Kanał do pwiadomieni został ustawiony na <#${men_kan.id}>`)]});
 
                    let o = client.db.prepare(`SELECT lvlUpChannel FROM leveling_settings WHERE guild_id = ?`).get(message.guild.id)
                    if (o) {
                        return client.db.prepare('UPDATE leveling_settings SET lvlUpChannel = ? WHERE guild_id = ?').run(men_kan.id, message.guild.id)
                    } else {
                        return client.db.prepare(`INSERT INTO leveling_settings(guild_id, lvlUpChannel) VALUES(?,?)`).run(message.guild.id, men_kan.id)
                    }
                }
            }

            case 'lvlUpMessage': {
                const text = args.slice(2).join(" ")
                if (!text) return message.reply({ embeds : [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Podaj tekst powiadomienia \n\n\`\`\`diff\n+ {member} ===> Oznaczenie osoby\n+ {tag} ===> Osoba z tagiem\n+ {id} ===> ID osoby\n+ {level} ===> Nowy level\n+ {rank} ===> Pozycja na serwerze\n+ {xp} ===> Łączny xp\n\`\`\`\n Pamiętaj że tekst może mieć maksymalnie 800 znaków!`).setFooter({text: `${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]})
                
                else if (text.length > 800) return message.reply({ embeds : [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Podaj tekst powiadomienia\n\n\`\`\`diff\n+ {member} ===> Oznaczenie osoby\n+ {tag} ===> Osoba z tagiem\n+ {id} ===> ID osoby\n+ {level} ===> Nowy level\n+ {rank} ===> Pozycja na serwerze\n+ {xp} ===> Łączny xp\n\`\`\`\n Maksymalnie może być 800 znaków!`).setFooter({text: `${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]})

                else {
                    message.reply({ embeds : [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.yes} Ustawiono tekst powiadomienia!`).setFooter({text: `${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]})

                    let i = client.db.prepare(`SELECT text FROM member_add WHERE guild_id = ?`).get(message.guild.id);
                    if(i){
                        return client.db.prepare('UPDATE member_add SET text = ? WHERE guild_id = ?').run(text, message.guild.id);
                    }else{
                        return client.db.prepare(`INSERT INTO member_add(guild_id, text) VALUES(?,?)`).run(message.guild.id, text);
                    }
                }
            }

            case 'lvlBoostRole': {

            }

            case 'help' :
            default : {
                return message.reply({embeds: [new MessageEmbed().setColor(client.config.color).setDescription(`>>> ${emotki.yes} Objce konfiguracji leveli:\n\n\`\`\`diff\n+ leveling on/off\n+ leveling lvlUpChannel \n+ leveling lvlUpMessage \n+ leveling lvlBoostRole\n\`\`\``).setFooter({text :`${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]})
            }
        }
    }
}