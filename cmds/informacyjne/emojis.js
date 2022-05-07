const { MessageEmbed } = require("discord.js")
const emotki = require ('../../base/emotki.json')

module.exports = {
    name : 'emojis',
    category : 'informacyjne',
    description : 'Inforamcje o emotkach na serwerze',
run : async(client, message, args) => {

    let Emojis = "";
        let EmojisAnimated = "";
        let EmojiCount = 0;
        let Animated = 0;
        let OverallEmojis = 0;
        function Emoji(id) {
            return client.emojis.cache.get(id).toString();
        }
        message.guild.emojis.cache.forEach((emoji) => {
            OverallEmojis++;
            if (emoji.animated) {
                Animated++;
                EmojisAnimated += Emoji(emoji.id);
            } else {
                EmojiCount++;
                Emojis += Emoji(emoji.id);
            }
        });
        let msg = await message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor(client.config.color).setDescription(`${emotki.loading} Ładowanie emoji...`)], allowedMentions: { repliedUser: false }})
        let Embed = new MessageEmbed()
            .setColor(client.config.color)
            .setDescription(`>>> ${emotki.tick} **Lista emoji serwera ${message.guild.name}**\n\n**\`ANIMOWANE\`** **[** \`${Animated}\` **]**:\n\n${EmojisAnimated}\n\n**\`ZWYKŁE\`** **[** \`${EmojiCount}\` **]**:\n\n${Emojis}\n\n**\`Wszystkie emoji:\`** **[** \`${OverallEmojis}\` **]**`)
            .setFooter({text :`${message.author.tag} | (${message.author.id})`,iconURL :`${message.author.displayAvatarURL({dynamic: true})}`})
        await message.reply({ allowedMentions: { repliedUser: false }, ephemeral: true, embeds: [Embed], allowedMentions: { repliedUser: false }});
        msg.delete();
        client.cooldown_5sec.add(message.author.id);
        setTimeout(() => {
          client.cooldown_5sec.delete(message.author.id);
        }, 5000);
        return;
    }
}