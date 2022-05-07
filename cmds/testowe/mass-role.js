/*
const { Discord, MessageEmbed } = require("discord.js");
const emotki = require ('../../base/emotki.json')

module.exports = {
    name : 'mass-role',
    aliases: ['mrole'],
    category : 'moderacyjne',
    description : 'Masowo najade rolę użytkownikom',
    run : async(client, message, args) => {
        try {


            if (!message.guild.me.permissions.has("MANAGE_ROLES")) {
                return message.reply(new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Bot nie posiada permisji do masowego nadawania ról **(**\`🔒 MANAGE_ROLES\`**)**`))
            }
            if (!message.member.permissions.has("ADMINISTRATOR")) {
                return message.reply(new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Nie posiadasz permisji do masowego nadawania ról **(**\`🔒 ADMINISTRATOR\`**)**`))
            }

            let roles = message.mentions.roles;
            if(!roles) return message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Poprawny schemat komendy\n\n\`\`\`diff\n+ mass-role <@role1> <@role2>\`\`\``)] })

            let rola1 = roles[0];
            if(!rola1) return message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Poprawny schemat komendy\n\n\`\`\`diff\n+ mass-role <@role1> <@role2>\`\`\``)] })

            let rola2 = roles[1];
            if(!rola2) return message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Poprawny schemat komendy\n\n\`\`\`diff\n+ mass-role <@role1> <@role2>\`\`\``)] })
            let count = 0;

            let msg = message.channel.send({ embeds: [new MessageEmbed().setDescription(`>>> ${emotki.loading} Trwa nadawanie ról`).setColor("GREEN").setFooter(`${message.author.tag} | (${message.author.id})`, `${message.author.displayAvatarURL({dynamic: true})}`)] })

            message.guild.members.cache.forEach(m => {
                if(m.roles.cache.some(role => role.id === rola1.id)) {
                    if(m.roles.cache.some(r => r.id === rola2.id)) return;
                    m.roles.add(message.guild.roles.cache.get(rola2.id));
                    count++;
                }else{
                    return;
                }
            })

            msg.edit({ embeds: [new MessageEmbed().setDescription(`>>> ${emotki.tak} Nadano role ${rola2} dla ${count} użytkowników`).setColor("GREEN").setFooter(`${message.author.tag} | (${message.author.id})`, `${message.author.displayAvatarURL({dynamic: true})}`)], ephemeral: true})
            return message.react("✅");


        }catch(e){
            console.log(e);
        }
    }
}
*/