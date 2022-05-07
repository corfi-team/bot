const { MessageEmbed } = require('discord.js')
const emotki = require ('../../base/emotki.json')

module.exports = {
    name : 'add-role',
    aliases: ['ar'],
    category : 'moderacyjne',
    description : 'Nadaje rolę uzytkownikowi',
    run : async(client, message, args) => {
        if (!message.guild.me.permissions.has("MANAGE_ROLES")) {
            return message.reply({embeds: [ new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Bot nie ma permisji do zarządzania rolami **(**\`🔒 MANAGE_ROLES\`**)**`)]})
        }else if (!message.member.permissions.has("MANAGE_ROLES")) {
            return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Nie posiadasz permisji do zarządzania rolami **(**\`🔒 MANAGE_ROLES\`**)**`)]})
        }
        const rola = message.mentions.roles.first() || message.guild.roles.cache.get((args[0])) || message.guild.roles.cache.find(x => x.name === (args[0]))
        if(!rola) return message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Poprawny schemat komendy\n\n\`\`\`diff\n+ add-role <@Role> <@user>\n+ add-role <Role> <User>\n+ add-role <RoleID> <UserID>\n\`\`\``)] })
        if(!(args[1])) return message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Poprawny schemat komendy\n\n\`\`\`diff\n+ add-role <@Role> <@user>\n+ add-role <Role> <User>\n+ add-role <RoleID> <UserID>\n\`\`\``)] })
        const member = message.mentions.members.first() || message.guild.members.cache.get((args[1])) || message.guild.members.cache.find(m => m.user.username == (args[1]));
        if(!member) return message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Poprawny schemat komendy\n\n\`\`\`diff\n+ add-role <@Role> <@user>\n+ add-role <Role> <User>\n+ add-role <RoleID> <UserID>\n\`\`\``)] })
        if(message.member.roles.highest.position <= member.roles.highest.position){
            return message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("#ff0000").setDescription(`>>> ${emotki.not} Nie możesz nadać roli dla użytkownika o podobnych permisjach`)]})
        }
        if(!member.manageable || !rola.editable){
            return message.reply({allowedMentions: { repliedUser: false }, embeds: [ new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Bot nie może wykonać tej akcji. ${member} ma wyższe permisje lub rola ${rola} nie jest zarządzalna`)], ephemeral: true});
        }

            member.roles.add(message.guild.roles.cache.get(rola.id));
            message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setDescription(`>>> ${emotki.tak} Nadałeś rolę **${rola.name}** dla **${member.user.tag}**`).setColor("GREEN").setFooter(`${message.author.tag} | (${message.author.id})`, `${message.author.displayAvatarURL({dynamic: true})}`)], ephemeral: true})
            return message.react("✅");
    }
}