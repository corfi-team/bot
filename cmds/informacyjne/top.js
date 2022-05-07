const { MessageEmbed } = require(`discord.js`);
const emotki = require ("../../base/emotki.json")

module.exports = {
    name : 'top',
    category : 'informacyjne',
    description : 'Informacje o aktywność top user/channel/global',
    run : async(client, message, args) => {
        
        switch(args[0]) {
            case 'user': 
            case 'użytkownik': {
                const baza = client.db.prepare('SELECT * FROM top WHERE guild_id = ?').all(message.guild.id)
                const lista = baza.sort((a,b) => b.ilosc - a.ilosc)
                let wiad = ''

                for(let kot = 0 ; kot < 10 ; kot++) {
                    const data = lista[kot]
                    if (data && data?.user_id != null && data?.ilosc != null) {
                        let medal = ''
                        switch (kot) {
                            case 0: {
                                medal = '🥇' 
                                break
                            }
                            case 1: {
                                medal = '🥈' 
                                break
                            }
                            case 2: {
                                medal = '🥉' 
                                break
                            }
                        }
                        if (data?.user_id === message.author.id) wiad += `** \n${medal} ${kot + 1}. <@!${data?.user_id}> ${data?.ilosc} **`
                        else wiad += `\n${medal} ${kot + 1}. <@!${data?.user_id}> ${data?.ilosc}`
                    }
                }
                const config = new MessageEmbed()
                    .setColor(client.config.color)
                    .setAuthor({name :`🏆 Top 10 użytwkoników na serwerze: ${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true})})
                    .setDescription(`${wiad || 'Niki nie pisze na tym serwerze. Lub ta obcja jest wyłączona!'}`)
                    .setTimestamp()
                    .setFooter({text :`Więcej informacji: top help `, iconURL :`${message.author.displayAvatarURL({dynamic: true})}`})
                return message.reply({ embeds: [config]})
            }
            case 'channel':
            case 'kanal': {
                const baza = client.db.prepare('SELECT * FROM top WHERE guild_id = ?').all(message.guild.id)
                const lista = baza.sort((a,b) => b.ilosc_channel - a.ilosc_channel)
                let wiad = ''

                for(let kot = 0 ; kot < 10 ; kot++) {
                    const data = lista[kot]
                    if (data && data?.channel_id != null && data?.ilosc_channel != null) {
                        let medal = ''
                        switch (kot) {
                            case 0: {
                                medal = '🥇' 
                                break
                            }
                            case 1: {
                                medal = '🥈' 
                                break
                            }
                            case 2: {
                                medal = '🥉' 
                                break
                            }
                        }
                        if (data?.channel_id === message.channel.id) wiad += `**\n${medal} ${kot + 1}. <#${data?.channel_id}> ${data?.ilosc_channel} **`
                        else wiad += `\n${medal} ${kot + 1}. <#${data?.channel_id}> ${data?.ilosc_channel}` 
                    }
                }
                
                const config = new MessageEmbed()
                    .setColor(client.config.color)
                    .setAuthor({name :`🏆 Top 10 kanałów na serwerze: ${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true})})
                    .setDescription(`${wiad || 'Niki nie pisze na tym serwerze. Lub ta obcja jest wyłączona!'}`)
                    .setTimestamp()
                    .setFooter({text :`Więcej informacji: top help `, iconURL :`${message.author.displayAvatarURL({dynamic: true})}`})
                return message.reply({ embeds: [config]});
            } 

            case 'global' : {
                const baza = client.db.prepare('SELECT * FROM top').all()
                const lista = baza.sort((a,b) => b.user_global_ilosc - a.user_global_ilosc)
                let wiad = ''
    
                for(let kot = 0 ; kot < 10 ; kot++) {
                    const data = lista[kot]
                    if (data && data?.user_global_id != null && data?.user_global_ilosc != null) {
                        let medal = ''
                        switch (kot) {
                            case 0: {
                                medal = '🥇' 
                                break
                            }
                            case 1: {
                                medal = '🥈' 
                                break
                            }
                            case 2: {
                                medal = '🥉' 
                                break
                            }
                        }
                        if (data?.user_global_id === message.author.id) wiad += `** \n${medal} ${kot + 1}. <@!${data?.user_global_id}> ${data?.user_global_ilosc} **`
                        else wiad += `\n${medal} ${kot + 1}. <@!${data?.user_global_id}> ${data?.user_global_ilosc}`
                    }
                }
                const config = new MessageEmbed()
                    .setColor(client.config.color)
                    .setAuthor({name :`🏆 Top 10 osób (Globalnie)`, iconURL: message.guild.iconURL({ dynamic: true})})
                    .setDescription(`${wiad || 'Niki nie pisze na tym serwerze. Lub ta obcja jest wyłączona!'}`)
                    .setTimestamp()
                    .setFooter({text :`Więcej informacji: top help `, iconURL :`${message.author.displayAvatarURL({dynamic: true})}`})
                return message.reply({ embeds: [config]});
            }
            case 'help' :
            default : {
                return message.reply({embeds: [new MessageEmbed().setColor(client.config.color).setDescription(`>>> ${emotki.yes} Licznik wiadomość :\n\n\`\`\`diff\n+ top user\n+ top channel\n+ top global\n\`\`\``).setFooter({text :`${message.author.tag} | (${message.author.id})`, iconURL: `${message.author.displayAvatarURL({dynamic: true})}`})]})
            }
        }
    }
}

