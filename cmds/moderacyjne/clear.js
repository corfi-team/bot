const { MessageEmbed } = require('discord.js')
const emotki = require ('../../base/emotki.json')

module.exports = {
    name : 'clear',
    aliases: ['purge', 'usun'],
    category : 'moderacyjne',
    description : 'Usuwa obecny kanał',
    run : async(client, message, args) => {

        if (!message.guild.me.permissions.has("MANAGE_CHANNELS")) {
            return message.reply({embeds: [ new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Bot nie ma permisji do zarządzania kanałami **(**\`🔒 MANAGE_CHANNELS\`**)**`)]})
        }else if (!message.member.permissions.has("MANAGE_CHANNELS")) {
            return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Nie posiadasz permisji do zarządzania kanałami **(**\`🔒 MANAGE_CHANNELS\`**)**`)]})
        }

        if(!args[0]) {
            return message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Podaj ilość wiadomości do usunięcia`).setFooter(`${message.author.tag} | (${message.author.id})`, `${message.author.displayAvatarURL({dynamic: true})}`)], ephemeral: true })
        }
        if ((args[0]) < 0 || (args[0]) > 99) {
            return message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Ilość wiadomości do usunięcia musi być z przedziału 0-99`).setFooter(`${message.author.tag} | (${message.author.id})`, `${message.author.displayAvatarURL({dynamic: true})}`)], ephemeral: true })
        }

        message.delete();
        const { size } = await message.channel.bulkDelete(parseInt((args[0]))+1).catch((err) => {
            return message.channel.send({ embeds: [new MessageEmbed()
            .setColor('RED')
            .setDescription(`>>> ${emotki.not} Nie można usunąć wiadomości sprzed 14 dni`)] })
        })
        message.channel.send({ embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Usunięto ${size} wiadomości`).setFooter(`${message.author.tag} | (${message.author.id})`, `${message.author.displayAvatarURL({dynamic: true})}`)] }).then(msg => {
            setTimeout(() => msg.delete(), 2000)
          })
          client.cooldown_5sec.add(message.author.id);
          setTimeout(() => {
            client.cooldown_5sec.delete(message.author.id);
          }, 5000);
          return;
    }
}