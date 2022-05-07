const { MessageEmbed } = require('discord.js')
const emotki = require ('../../base/emotki.json')

module.exports = {
    name : 'lock',
    aliases: ['l'],
    category : 'moderacyjne',
    description : 'Blokuje kanał',
    run : async(client, message, args) => {

            if (!message.guild.me.permissions.has("MANAGE_CHANNELS")) {
                return message.reply({allowedMentions: { repliedUser: false }, embeds: [ new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Bot nie ma permisji do zarządzania kanałami **(**\`🔒 MANAGE_CHANNELS\`**)**`)]})
            }else if (!message.member.permissions.has("MANAGE_CHANNELS")) {
                return message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Nie posiadasz permisji do zarządzania kanałami **(**\`🔒 MANAGE_CHANNELS\`**)**`)]})
            }
            const user_role = client.db.prepare('SELECT user_role FROM serwer WHERE guild_id = ?', [message.guild.id]);
            if(!user_role.user_role){
                return message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("#ff0000").setDescription(`>>> ${emotki.not} Ustaw rolę użytkownika **(** \`🔒 set userrole @rola\` **)**`)], ephemeral: true })
            }

            message.channel.permissionOverwrites.set([{ id: user_role , allow: ['VIEW_CHANNEL'], deny: ['SEND_MESSAGES', 'ADD_REACTIONS', 'CREATE_INSTANT_INVITE'] }]);
            message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("GREEN").setDescription(`>>> ${emotki.tak} Kanał został zablokowany.`).setFooter(`${message.author.tag} | (${message.author.id})`, `${message.author.displayAvatarURL({dynamic: true})}`)] })
            message.react("✅");
            client.cooldown_5sec.add(message.author.id);
            setTimeout(() => {
              client.cooldown_5sec.delete(message.author.id);
            }, 5000);
            return;
    }
}