const {MessageEmbed} = require('discord.js')
const emotki = require('../base/emotki.json')
const fetch = require('node-fetch')


module.exports = {
    name: "join",
    usage: "join <channel>",
    async run(message, args) {

        const text = args.slice(2).join(" ")

        const prefix = client.db.prepare('SELECT prefix FROM serwer WHERE guild_id = ?').get(message.guild.id)?.prefix || '%'

        switch (args[1]) {

            case "kanal":
            case "channel": {
                let men_kan = message.mentions.channels.first();
                if (!men_kan || men_kan.guild.id !== message.guild.id || !message.guild.channels.cache.find(c => c.id === men_kan.id) && men_kan.type == "GUILD_TEXT") return message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Podano nieodpowiedni kanał powitań!`)]})

                else {
                    message.reply({ embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Kanał do powitań został ustawiony na <#${men_kan.id}>`)]});
 
                    let i = client.db.prepare(`SELECT channel_id FROM member_add WHERE guild_id = ?`).get(message.guild.id);
                    if(i){
                        client.db.prepare('UPDATE member_add SET channel_id = ? WHERE guild_id = ?').run(men_kan.id, message.guild.id);
                    }else{
                        client.db.prepare(`INSERT INTO member_add(guild_id, channel_id) VALUES(?,?)`).run(message.guild.id, men_kan.id);
                    }

                    let o = client.db.prepare('SELECT powitanie FROM member_add WHERE guild_id = ?').get(message.guild.id)
                    if(o){
                        return client.db.prepare('UPDATE member_add SET powitanie = ? WHERE guild_id = ?').run('on', message.guild.id);
                    }else{
                        return client.db.prepare(`INSERT INTO member_add(guild_id, powitanie) VALUES(?,?)`).run(message.guild.id, 'on');
                    }
                }
            }

            case "kolor":
            case "color": {

                if (!args[2]) return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Pamiętaj że kolor musi być w [HEX](https://www.color-hex.com/) \n\n\`\`\`diff\n+ ${prefix}set ${args[0]} ${args[1]} #88ff88 \`\`\``).setFooter({text :`${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]})                

                else if (args.length > 3) return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Podano za dużo argumentów\n\n\`\`\`diff\n+ ${prefix}set ${args[0]} ${args[1]} #88ff88 \`\`\``).setFooter({text :`${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]})                

                else {
                    const color = args[2].replace('#', '')

                    const res = await fetch(`https://api.alexflipnote.dev/color/${color}`, {
                        method: 'GET',
                    }).then(res => res.json())
                    .catch(r => {
                        return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Nie ma taiego koloru!\n\n\`\`\`diff\n+ ${prefix}set ${args[0]} ${args[1]} #88ff88 \`\`\``).setFooter({text :`${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]})                      
                    })

                    if (!res) return
                    else if (res && res.code == 400) {
                        return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Nie ma taiego koloru!\n\n\`\`\`diff\n+ ${prefix}set ${args[0]} ${args[1]} #88ff88 \`\`\``).setFooter({text :`${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]})                      
                    }
                    else {
                        message.reply({embeds: [new MessageEmbed().setColor(color).setDescription(`>>> ${emotki.tak} Ustawiono kolor powitań!`).setFooter({text :`${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]})                

                        let i = client.db.prepare(`SELECT kolor FROM member_add WHERE guild_id = ?`).get(message.guild.id);
                        if(i){
                            return client.db.prepare('UPDATE member_add SET kolor = ? WHERE guild_id = ?').run(color, message.guild.id);
                        }else{
                            return client.db.prepare(`INSERT INTO member_add(guild_id, kolor) VALUES(?,?)`).run(message.guild.id, color);
                        }
                    }
                }
            }

            case "tytul":
            case "title": {

                if (!text) return message.reply({ embeds : [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Podaj tytuł powitania \n\n\`\`\`diff\n+ {tag} ===> Nowa osoba z tagiem\n+ {id} ===> ID nowej osoby\n+ {liczba} ===> Ilość osoób na serwerze\n+ {nazwa} ===> Nazwa serwera\n+ {czas} ===> Pokazuje kiedy konto zostało stworzone\n\`\`\`\n Pamiętaj że tekst może mieć maksymalnie 50 znaków!`).setFooter({text: `${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]})

                else if (text.length > 50) return message.reply({ embeds : [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Podaj tytuł powitania \n\n\`\`\`diff\n+ {tag} ===> Nowa osoba z tagiem\n+ {id} ===> ID nowej osoby\n+ {liczba} ===> Ilość osoób na serwerze\n+ {nazwa} ===> Nazwa serwera\n+ {czas} ===> Pokazuje kiedy konto zostało stworzone\n\`\`\`\n Pamiętaj że tekst może mieć maksymalnie 50 znaków!`).setFooter({text: `${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]})

                else {
                    message.reply({ embeds : [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.yes} Ustawiono tytuł powitania!`).setFooter({text: `${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]})
    
                    let i = client.db.prepare(`SELECT tytul FROM member_add WHERE guild_id = ?`).get(message.guild.id);
                    if(i){
                        return client.db.prepare('UPDATE member_add SET tytul = ? WHERE guild_id = ?').run(text, message.guild.id);
                    }else{
                        return client.db.prepare(`INSERT INTO member_add(guild_id, tytul) VALUES(?,?)`).run(message.guild.id, text);
                    }
                }
            }

            case "tekst":
            case "text": {

                if (!text) return message.reply({ embeds : [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Podaj tekst powitania \n\n\`\`\`diff\n+ {osoba} ===> Nowa osoba\n+ {tag} ===> Nowa osoba z tagiem\n+ {id} ===> ID nowej osoby\n+ {liczba} ===> Ilość osoób na serwerze\n+ {nazwa} ===> Nazwa serwera\n+ {czas} ===> Pokazuje kiedy konto zostało stworzone\n\`\`\`\n Pamiętaj że tekst może mieć maksymalnie 800 znaków!`).setFooter({text: `${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]})
                
                else if (text.length > 800) return message.reply({ embeds : [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Podaj tekst powitania \n\n\`\`\`diff\n+ {osoba} ===> Nowa osoba\n+ {tag} ===> Nowa osoba z tagiem\n+ {id} ===> ID nowej osoby\n+ {liczba} ===> Ilość osoób na serwerze\n+ {nazwa} ===> Nazwa serwera\n+ {czas} ===> Pokazuje kiedy konto zostało stworzone\n\`\`\`\n Pamiętaj że tekst może mieć maksymalnie 800 znaków!`).setFooter({text: `${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]})

                else {
                    message.reply({ embeds : [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.yes} Ustawiono tekst!`).setFooter({text: `${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]})

                    let i = client.db.prepare(`SELECT text FROM member_add WHERE guild_id = ?`).get(message.guild.id);
                    if(i){
                        return client.db.prepare('UPDATE member_add SET text = ? WHERE guild_id = ?').run(text, message.guild.id);
                    }else{
                        return client.db.prepare(`INSERT INTO member_add(guild_id, text) VALUES(?,?)`).run(message.guild.id, text);
                    }
                }
            }

            case "tekst_embed":
            case "text_embeds": {

                if (!text) return message.reply({ embeds : [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Podaj tekst powitania \n\n\`\`\`diff\n+ {osoba} ===> Nowa osoba\n+ {tag} ===> Nowa osoba z tagiem\n+ {id} ===> ID nowej osoby\n+ {liczba} ===> Ilość osoób na serwerze\n+ {nazwa} ===> Nazwa serwera\n+ {czas} ===> Pokazuje kiedy konto zostało stworzone\n\`\`\`\n Pamiętaj że tekst może mieć maksymalnie 800 znaków!`).setFooter({text: `${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]})
                
                else if (text.length > 800) return message.reply({ embeds : [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Podaj tekst powitania \n\n\`\`\`diff\n+ {osoba} ===> Nowa osoba\n+ {tag} ===> Nowa osoba z tagiem\n+ {id} ===> ID nowej osoby\n+ {liczba} ===> Ilość osoób na serwerze\n+ {nazwa} ===> Nazwa serwera\n+ {czas} ===> Pokazuje kiedy konto zostało stworzone\n\`\`\`\n Pamiętaj że tekst może mieć maksymalnie 800 znaków!`).setFooter({text: `${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]})

                else {
                    message.reply({ embeds : [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.yes} Ustawiono tekst embeda!`).setFooter({text: `${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]})

                    let i = client.db.prepare(`SELECT text_embeds FROM member_add WHERE guild_id = ?`).get(message.guild.id);
                    if(i){
                        return client.db.prepare('UPDATE member_add SET text_embeds = ? WHERE guild_id = ?').run(text, message.guild.id);
                    }else{
                        return client.db.prepare(`INSERT INTO member_add(guild_id, text_embeds) VALUES(?,?)`).run(message.guild.id, text);
                    }
                }
            }

            case "obraz":
            case "image": {
                const messageAttachment = message.attachments.first()

                if (!messageAttachment) return message.reply({ embeds : [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Wyślij zdjęcie aby zostało zapisane!`).setFooter({text: `${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]}) 
                else {

                    message.reply({ embeds : [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.yes} Ustawiono obraz embeda!`).setFooter({text: `${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]})

                    let i = client.db.prepare(`SELECT obraz FROM member_add WHERE guild_id = ?`).get(message.guild.id);
                    if(i){
                        return client.db.prepare('UPDATE member_add SET obraz = ? WHERE guild_id = ?').run(messageAttachment?.attachment, message.guild.id);
                    }else{
                        return client.db.prepare(`INSERT INTO member_add(guild_id, obraz) VALUES(?,?)`).run(message.guild.id, messageAttachment?.attachment);
                    }
                }
            }


            case "embed_on":
            case "embeds_on": {

                message.reply({ embeds : [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.yes} Embed zosal włączony!`).setFooter({text: `${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]})
                let o = client.db.prepare('SELECT powitanie FROM member_add WHERE guild_id = ?').get(message.guild.id)

                if(o){
                    return client.db.prepare('UPDATE member_add SET powitanie = ? WHERE guild_id = ?').run('on', message.guild.id);
                }else{
                    return client.db.prepare(`INSERT INTO member_add(guild_id, powitanie) VALUES(?,?)`).run(message.guild.id, 'on');
                }
            }

            case "embed_off":
            case "embeds_off": {

                message.reply({ embeds : [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.yes} Embed zosal wyłączony!`).setFooter({text: `${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]})
                let o = client.db.prepare('SELECT powitanie FROM member_add WHERE guild_id = ?').get(message.guild.id)

                if(o){
                    return client.db.prepare('UPDATE member_add SET powitanie = ? WHERE guild_id = ?').run('off', message.guild.id);
                }else{
                    return client.db.prepare(`INSERT INTO member_add(guild_id, powitanie) VALUES(?,?)`).run(message.guild.id, 'off');
                }
            }

            case 'usun': 
            case 'delete': {
                switch (args[2]) {

                    case 'kanal':
                    case 'channel': {
                        client.db.prepare(`UPDATE member_add SET channel_id = null WHERE guild_id = ?`).run(message.guild.id)
                        return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]})
                    }

                    case 'kolor':
                    case 'color': {
                        client.db.prepare(`UPDATE member_add SET kolor = null WHERE guild_id = ?`).run(message.guild.id)
                        return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]})
                    }

                    case 'text_embed':
                    case 'text_embeds': {
                        client.db.prepare(`UPDATE member_add SET text_embeds = null WHERE guild_id = ?`).run(message.guild.id)
                        return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]})
                    }
                    
                    case 'tekst':
                    case 'text': {
                        client.db.prepare(`UPDATE member_add SET text = null WHERE guild_id = ?`).run(message.guild.id)
                        return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]})
                    }

                    case 'obraz':
                    case 'image': {
                        client.db.prepare(`UPDATE member_add SET obraz = null WHERE guild_id = ?`).run(message.guild.id)
                        return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]})
                    }

                    case 'tytul':
                    case 'title': {
                        client.db.prepare(`UPDATE member_add SET tytul = null WHERE guild_id = ?`).run(message.guild.id)
                        return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]})
                    }
                   
                    default: {
                        return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Opcje usunięcia :\n\n\`\`\`diff\n+ channel\n+ color\n+ title\n+ text\n+ text_embeds\n+ image\`\`\``).setFooter({text :`${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]})
                    }
                }
            }

            default: {
                return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Opcje konfiguracji powitań:\n\n\`\`\`diff\n+ channel\n+ color\n+ title\n+ text\n+ text_embeds\n+ image\n+ embeds_off / embeds_on\n\n- delete\`\`\``).setFooter({text :`${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]})
            }
        }
    }
}