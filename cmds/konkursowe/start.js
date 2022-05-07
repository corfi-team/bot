const { MessageEmbed } = require('discord.js')
const ms = require('ms');
const e = require('../../base/emotki.json');

module.exports = {
    name : 'giveaway',
    aliases: ['start', 'ga'],
    category : 'konkursowe',
    description : 'Tworzy giveaway',
    run : async(client, message, args) => {
        if(!message.member.permissions.has("MANAGE_GUILD")){
            return message.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${e.not} **Wystąpił błąd**\n>>> Nie posiadasz uprawnienia: **ZARZĄDZANIE SERWEREM**`).setFooter(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())]})
        }
        if(!message.guild.me.permissions.has("MANAGE_GUILD")){
            return message.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${e.not} **Wystąpił błąd**\n>>> Corfi nie posiada uprawnienia: **ZARZĄDZANIE SERWEREM**`).setFooter(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())]})
        }

        let ile = client.giveawaysManager.giveaways.filter(element => element.ended === false && element.guildId === message.guild.id).length;
        if(ile >= 3){
            return message.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${e.not} Na tym serwerze odbywają się już 3 aktywne losowania!`).setFooter(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())]})
        }

        let duration = (args[0]);
        if(!duration || !ms(duration)){
            return message.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${e.not} **Wystąpił błąd**\n>>> Podaj czas trwania losowania\n\`\`\`diff\n+ 1m\n+ 1h\n+ 1d\n\`\`\``).setFooter(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())]})
        }

        if(ms(duration) > 2764800000){
          return message.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${e.not} Czas losowania przekracza 32 dni`).setFooter(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())]})
        }

        let wc = (args[1]);
        if(!wc){
            return message.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${e.not} **Wystąpił błąd**\n>>> Podaj ilość zwycięzców losowania`).setFooter(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())]})
        }else{
            if(!Number.isInteger(parseInt(wc)) || (args[1]) < 0){
                return message.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${e.not} **Wystąpił błąd**\n>>> Ilość zwycięzców musi być liczbą całkowitą większą od 0`).setFooter(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())]})
            }
        }
        let prize = args.slice(2).join(" ")
        if(!prize){
            return message.reply({ embeds: [new MessageEmbed().setColor("RED").setDescription(`${e.not} **Wystąpił błąd**\n>>> Podaj nagrodę na wygranie losowania`).setFooter(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())]})
        }
        let winnerCount = parseInt(wc);
        return await client.giveawaysManager.start(message.channel, {
            duration: ms(duration),
            winnerCount,
            prize,
            lastChance: {
                enabled: true,
                content: '🎈 **Ostatnia szansa na dołączenie!** 💎',
                threshold: 10000,
                embedColor: '#ffea00'
            }
        });
    }
}