const { MessageEmbed } = require('discord.js')
const ms = require('ms');
const e = require('../../base/emotki.json');

module.exports = {
    name : 'edit',
    aliases: ['editgiveaway'],
    category : 'konkursowe',
    description : 'Edytuje giveawaya',
    run : async(client, message, args) => {
        if(!message.member.permissions.has("MANGE_GUILD")){
            return message.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${e.not} **Wystąpił błąd**\n>>> Nie posiadasz uprawnienia: **ZARZĄDZANIE SERWEREM**`).setFooter(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())]})
        }
        if(!message.guild.me.permissions.has("MANGE_GUILD")){
            return message.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${e.not} **Wystąpił błąd**\n>>> Corfi nie posiada uprawnienia: **ZARZĄDZANIE SERWEREM**`).setFooter(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())]})
        }

        let messageId = (args[0])
        if(!messageId){
            return message.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${e.not} **Wystąpił błąd**\n>>> Podaj ID wiadomości z losowaniem`).setFooter(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())]})
        }

        let opcja = (args[1])
        if(!opcja){
            return message.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${e.not} **Wystąpił błąd**\n>>> Podaj opcję losowania jaką chcesz edytować\n\`\`\`diff\n+ new-prize\n+ add-time\n+ new-winners\n\`\`\``).setFooter(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())]})
        }else{
            if(opcja === "add-time"){
                let duration = (args[2]);
                if(!duration || !ms(duration)){
                    return message.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${e.not} **Wystąpił błąd**\n>>> Podaj ile czasu chcesz dodać do końca losowania\n\`\`\`diff\n+ 1m\n+ 1h\n+ 1d\n\`\`\``).setFooter(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())]})
                }
                client.giveawaysManager.edit(messageId, {
                    addTime: ms(duration)
                }).then(() => {
                    message.react("✅");
                }).catch((err) => {
                    message.react("❌");
                    return console.log(err);
                });
                client.cooldown_5sec.add(message.author.id);
                setTimeout(() => {
                  client.cooldown_5sec.delete(message.author.id);
                }, 5000);
                return;
            }else{
                if(opcja ==="new-winners"){
                    let wc = (args[2]);
                    if(!wc){
                        return message.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${e.not} **Wystąpił błąd**\n>>> Podaj nową liczbę zwycięzców`).setFooter(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())]})
                    }else{
                        if(!Number.isInteger(parseInt(wc)) || wc < 0){
                            return message.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${e.not} **Wystąpił błąd**\n>>> Nowa ilość zwycięzców musi być liczbą całkowitą większą od 0`).setFooter(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())]})
                        }
                    }
                    client.giveawaysManager.edit(messageId, {
                        newWinnerCount: wc
                    }).then(() => {
                        message.react("✅");
                    }).catch((err) => {
                        message.react("❌");
                        return console.log(err);
                    });
                    client.cooldown_5sec.add(message.author.id);
                    setTimeout(() => {
                      client.cooldown_5sec.delete(message.author.id);
                    }, 5000);
                    return;
                }else{
                    if(opcja === "new-prize"){
                        let prize = args.slice(2).join(" ")
                        if(!prize){
                            return message.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${e.not} **Wystąpił błąd**\n>>> Napisz jaka jest nowa nagroda za wygranie losowania`).setFooter(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())]})
                        }
                        client.giveawaysManager.edit(messageId, {
                            newPrize: prize
                        }).then(() => {
                            message.react("✅");
                        }).catch((err) => {
                            message.react("❌");
                            return console.log(err);
                        });
                        client.cooldown_5sec.add(message.author.id);
                        setTimeout(() => {
                          client.cooldown_5sec.delete(message.author.id);
                        }, 5000);
                        return;
                    }
                }
            }
        }
    }
}