const { Discord, MessageActionRow, MessageSelectMenu, MessageEmbed } = require("discord.js");
const e = require ('../../base/emotki.json')

module.exports = {
    name : 'nuke',
    aliases: ['delete-channel'],
    category : 'moderacyjne',
    description : 'Usuwa obecny kanał',
    run : async(client, message, args) => {
                if (!message.guild.me.permissions.has("MANAGE_CHANNELS")) {
                    return message.reply({allowedMentions: { repliedUser: false }, embeds: [ new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Bot nie ma permisji do zarządzania kanałami **(**\`🔒 MANAGE_CHANNELS\`**)**`)]})
                }else if (!message.member.permissions.has("MANAGE_CHANNELS")) {
                    return message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Nie posiadasz permisji do zarządzania kanałami **(**\`🔒 MANAGE_CHANNELS\`**)**`)]})
                }

                const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                    .setCustomId("select")
                    .setPlaceholder("❔ Potwierdź wykonanie komendy")
                    .addOptions([
                        {
                            label: "Tak",
                            description: "Potwierdź",
                            emoji: e.tak,
                            value: "tak"
                        },
                        {
                            label: "Nie",
                            description: "Anuluj",
                            emoji: e.not,
                            value: "nie"
                        }
                    ])
                )

                let msg = message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("YELLOW").setDescription(`>>> Czy potwierdzasz czyszczenie całego kanału?`)], components: [row]})

                let option1 = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`>>> ${e.tak} Kanał usunięty`)

                let option2 = new MessageEmbed()
                .setColor("RED")
                .setDescription(`>>> ${e.nie} Operacja anulowana`)

                const collector = message.channel.createMessageComponentCollector({
                    time: 30000,
                    componentType: "SELECT_MENU"
                })

                collector.on("collect", async (collected) => {
                    const value = collected.values[0]
                    if(value === "tak"){
                        collected.reply({embeds: [option1], ephemeral: true })
                        message.channel.clone().then(channel => {
                            if (channel){
                                message.channel.delete();
                                channel.send({ embeds: [new MessageEmbed().setColor("GREEN").setDescription(`${e.tak} Pomyślnie utworzono nowy kanał`).setFooter(`${message.author.tag} | (${message.author.id})`, `${message.author.displayAvatarURL({dynamic: true})}`)] })
                                message.react("✅");
                                client.cooldown_5sec.add(message.author.id);
                                setTimeout(() => {
                                  client.cooldown_5sec.delete(message.author.id);
                                }, 5000);
                                return;
                            }else{
                                message.channel.send({ embeds: [new MessageEmbed().setColor("GREEN").setDescription(`${e.not} Coś poszło nie tak...`)] })
                            }
                        })
                    }
                    if(value === "nie"){
                        collected.reply({embeds: [option2], ephemeral: true })
                        return;
                    }
                })

                collector.on("end", async (collect) => {
                })
    }
}