const { MessageEmbed, MessageActionRow , MessageButton } = require("discord.js")
const e = require ('../../base/emotki.json');

module.exports = {
    name : 'bot',
    aliases: ["infobot", "bots"],
    category : 'informacyjne',
    description : 'Informacje o bocie',
    run : async(client, message, args) => {
        let uptime = (client.uptime / 1000);
        let dni = Math.floor(uptime / 86400);
        uptime %= 86400;
        let godziny = Math.floor(uptime / 3600); uptime %= 3600;
        let minuty = Math.floor(uptime / 60);
        let sekundy = Math.floor(uptime % 60);
        let czas = `${dni}d, ${godziny}h, ${minuty}m, ${sekundy}s`;
    const bot = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setLabel(`Dodaj`)
            .setStyle(`LINK`)
            .setURL(`https://discord.com/oauth2/authorize?client_id=813674836399620126&scope=bot&permissions=8`)
            .setEmoji(`${e.invite}`)
    )
    const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setAuthor({name: "Informacje o bocie", iconURL :`${message.author.displayAvatarURL({dynamic: true})}`})
        .addField(`\`🏓\`・Ping bota:`, `\`${client.ws.ping} ms\``,true)
        .addField(`\`💾\`・RAM`, `\`${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB\``, true)
        .addField(`\`⏰\`・Czas działania`, `\`${czas}\``,true)
        .addField(`\`🌍\`・Serwery:`, `\`${client.guilds.cache.size}\``, true)
        .addField(`\`📚\`・Kanały:`, `\`${client.channels.cache.size}\``, true)
        .addField(`\`🙍‍♂️\`・Użytkownicy:`, `\`${client.users.cache.size}\``, true)
        .addField(`\`🚩\`・Wersja:`, `\`v4\``, true)
        .setThumbnail(client.user.displayAvatarURL({dynamic: true}))
        .setFooter({text :`${message.author.tag} | (${message.author.id})`,iconURL :`${message.author.displayAvatarURL({dynamic: true})}`})
        message.reply({embeds: [embed], components: [bot], allowedMentions: { repliedUser: false }})
        client.cooldown_5sec.add(message.author.id);
        setTimeout(() => {
          client.cooldown_5sec.delete(message.author.id);
        }, 5000);
        return;
    }
}