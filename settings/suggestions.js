const {MessageEmbed} = require('discord.js')
const emotki = require('../base/emotki.json')
module.exports = {
    name: "suggestions",
    usage: "suggestions <channel>",
    async run(message, args) {
        let konf = (args[1])
        let tzy = (args[2])

        let baza = client.db.prepare('SELECT prefix FROM serwer WHERE guild_id = ?').get(message.guild.id)
        const prefix = baza?.prefix || "%"
    
        try{ 
            if(!konf){
                return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.tak} Opcje konfiguracji propozycji : \n\n\`\`\`diff\n+ channel\n+ comments\n+ role\n\n- usun\`\`\``).setFooter(`${message.author.tag} | (${message.author.id})`, `${message.author.displayAvatarURL({dynamic: true})}`)]})
            }

            else if(konf === 'channel'){
                let men_kan = message.mentions.channels.first();
                if (!men_kan || men_kan.guild.id !== message.guild.id || !message.guild.channels.cache.find(c => c.id === men_kan.id) || men_kan.type == "GUILD_VOICE" || men_kan.type == "GUILD_NEWS" || men_kan.type == "GUILD_STAGE_VOICE") return message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setThumbnail(client.config.z_error).setDescription(`>>> ${emotki.not} Podano nieodpowiedni kanał!`)]})

                message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Kanał do propozycji został ustawiony na <#${men_kan.id}>`).setThumbnail(client.config.ustaw)]});

                let i = client.db.prepare(`SELECT channel_suggest FROM suggestions WHERE guild_id = ?`).get(message.guild.id);
                if(i){
                    return client.db.prepare('UPDATE suggestions SET channel_suggest = ? WHERE guild_id = ? AND typ = ? ').run(men_kan.id, message.guild.id, "2");
                }else{
                    return client.db.prepare(`INSERT INTO suggestions(guild_id, channel_suggest, typ) VALUES(?,?,?)`).run(message.guild.id, men_kan.id, "2");
                }                 
            }

            else if(konf === 'comments'){
                if(!tzy){
                    return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.tak} Opcje konfiguracji komentarzy : \n\n\`\`\`diff\n+ thread\n+ comment\n+ off\`\`\``).setFooter(`${message.author.tag} | (${message.author.id})`, `${message.author.displayAvatarURL({dynamic: true})}`)]})
                }

                if(tzy === 'thread'){
                    let i = client.db.prepare(`SELECT typ FROM suggestions WHERE guild_id = ?`).get(message.guild.id);
                    if(i){
                        client.db.prepare(`UPDATE suggestions SET typ = ? WHERE guild_id = ?`).run("2" , message.guild.id)
                    }else{
                        client.db.prepare(`INSERT INTO suggestions (guild_id, typ) VALUES(?,?)`).run(message.guild.id, "2");
                    }

                    return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} **Wątki** pod propozycjami zostały ustawione!`).setThumbnail(client.config.ustaw)]});
                }

                if(tzy === 'comment'){
                    let i = client.db.prepare(`SELECT typ FROM suggestions WHERE guild_id = ?`).get(message.guild.id);
                    if(i){
                        client.db.prepare(`UPDATE suggestions SET typ = ? WHERE guild_id = ?`).run("1" , message.guild.id)
                    }else{
                        client.db.prepare(`INSERT INTO suggestions (guild_id, typ) VALUES(?,?)`).run(message.guild.id, "1");
                    }

                    return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} **Komentarze** pod propozycjami zostały ustawione!`).setThumbnail(client.config.ustaw)]});
                }

                if(tzy === 'off'){
                    let i = client.db.prepare(`SELECT typ FROM suggestions WHERE guild_id = ?`).get(message.guild.id);
                    if(i){
                        client.db.prepare(`UPDATE suggestions SET typ = ? WHERE guild_id = ?`).run("0" , message.guild.id)
                    }else{
                        client.db.prepare(`INSERT INTO suggestions (guild_id, typ) VALUES(?,?)`).run(message.guild.id, "0");
                    }

                    return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} **Komentarze** pod propozycjami zostały wyłączone!`).setThumbnail(client.config.ustaw)]});
                }
            }

            else if(konf === 'role'){
                if(!tzy){
                    return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.tak} Ustaw jaka rola nie może wysyłać propozycji! : \n\n\`\`\`diff\n+ set suggestions roles 813674836399620126(Id roli) \n+ set suggestions roles (Oznaczenie role)\`\`\``).setFooter(`${message.author.tag} | (${message.author.id})`, `${message.author.displayAvatarURL({dynamic: true})}`)]})
                }
                let men_role = message.guild.roles.cache.get(args[2]) || message.mentions.roles.first();

                if(!men_role){
                    return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Oznacz role która nie będzie mogł wysyłać propozycji!`).setThumbnail(client.config.ustaw)]})
                }

                if(!message.guild.roles.cache.get(men_role.id)){
                    return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Oznacz role która nie będzie mogł wysyłać propozycji!`).setThumbnail(client.config.ustaw)]})
                }

                let i = client.db.prepare(`SELECT roles FROM suggestions WHERE guild_id = ?`).get(message.guild.id);
                if(i){
                    client.db.prepare(`UPDATE suggestions SET roles = ? WHERE guild_id = ?`).run(men_role.id , message.guild.id)
                }else{
                    client.db.prepare(`INSERT INTO suggestions (guild_id, roles) VALUES(?,?)`).run(message.guild.id, men_role.id);
                }
                return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Ustawiona rola : **${men_role.name}** \`${men_role.id}\`\n Pamiętaj ta rola nie będzie mogła używać propozycji!`).setThumbnail(client.config.ustaw)]})
            }
            else if (konf === 'usun'){
                if (!tzy){
                    return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Wymagane podanie nazwy kategorii\n\n\`\`\`diff\n+ role \n+ channel \n+ comments\n\`\`\``).setFooter({text: `${prefix}set <suggestions> <usun> <zmienna>`, iconURL: message.author.displayAvatarURL()})]});    
                }
                else if (tzy === 'roles'){
                    client.db.prepare(`UPDATE suggestions SET roles = null WHERE guild_id = ?`).run(message.guild.id)
                    return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]}) 
                }
                else if (tzy === 'channel'){
                    client.db.prepare(`UPDATE suggestions SET channel_suggest = null WHERE guild_id = ?`).run(message.guild.id)
                    return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]}) 
                }
                else if (tzy === 'comments'){
                    client.db.prepare(`UPDATE suggestions SET typ = 3 WHERE guild_id = ?`).run(message.guild.id)
                    return message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Konfiguracja została usunięta`)]})
                }
            }
            
        }catch (err){
            console.log(err)
            let error = new MessageEmbed()
                .setColor("RED")
                .setTitle(`Błąd w komendzie set suggestions`)
                .setDescription(`> Wystąpił błąd podczas używania komendy`)
            message.reply({ allowedMentions: { repliedUser: false }, ephemeral: true, embeds: [error]});

            embed = new MessageEmbed()
                .setColor("RED")
                .setTitle(`Błąd w komendzie set suggestions`)
                .setDescription(`**Użytkownik:** ${message.author.tag}  (\`${message.author.id}\`) \n**Serwer:** ${message.guild.name}  (\`${message.guild.id}\`)\n\`\`\`js\n${err}\n\`\`\``)
            return client.channels.cache.get(client.config.error).send({ephemeral: true, embeds: [embed]});
        }
    }
}