const {
  Discord,
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed,
} = require("discord.js");
const emotki = require("../../base/emotki.json");

module.exports = {
  name: "ban",
  aliases: ["b"],
  category: "moderacyjne",
  description: "Banuje uzytkownika",
  run: async (client, message, args) => {
    if (!message.guild.me.permissions.has("BAN_MEMBERS")) {
      return message.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `>>> ${emotki.not} Bot nie ma permisji do banowania **(**\`🔒 BAN_MEMBERS\`**)**`
            ),
        ],
      });
    } else if (!message.member.permissions.has("BAN_MEMBERS")) {
      return message.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `>>> ${emotki.not} Nie posiadasz permisji do banowania **(**\`🔒 BAN_MEMBERS\`**)**`
            ),
        ],
      });
    }

    if (!args[0])
      return message.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `>>> ${emotki.not} Poprawny schemat komendy\n\n\`\`\`diff\n+ ban <@user> [powód]\n+ ban <ID> [powód]\n\`\`\``
            ),
        ],
      });

    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);

    if (member) {
      if (member.id === message.author.id || member.id === client.user.id) {
        return message.reply({
          allowedMentions: { repliedUser: false },
          embeds: [
            new MessageEmbed()
              .setColor("#ff0000")
              .setDescription(
                `>>> ${emotki.not} Nie możesz przeprowadzić tej akcji na sobie ani bocie`
              ),
          ],
        });
      }

      if (
        message.member.roles.highest.position <= member.roles.highest.position
      ) {
        return message.reply({
          allowedMentions: { repliedUser: false },
          embeds: [
            new MessageEmbed()
              .setColor("#ff0000")
              .setDescription(
                `>>> ${emotki.not} Nie możesz zbanować użytkownika o podobnych permisjach`
              ),
          ],
        });
      } else {
        const reason = args.slice(1).join(" ") || "Brak";
        member.ban({ reason: reason });
        message.reply({
          allowedMentions: { repliedUser: false },
          embeds: [
            new MessageEmbed()
              .setDescription(
                `>>> ${emotki.tak} Pomyślnie zbanowałeś **${member.user.tag}**\n\n\`\`\`diff\n- ${reason}\n\`\`\``
              )
              .setColor("GREEN")
              .setFooter(
                `${message.author.tag} | (${message.author.id})`,
                `${message.author.displayAvatarURL({ dynamic: true })}`
              ),
          ],
          ephemeral: true,
        });

        const modlog = client.db
          .prepare("SELECT * FROM serwer WHERE guild_id = ?")
          .get(message.guild.id);
        if (!modlog.channel_modlog) return;

        const sex = new MessageEmbed()
          .setColor(`2f3136`)
          .setAuthor(`🕵️‍♂️ Użytkownik został zbanowany ${member.user.tag}`)
          .addField(
            `\`💥\` Zbanowany:`,
            `${member.user.tag} \`(${member.id})\``,
            true
          )
          .addField(`\`🔱\` Moderator:`, `${message.author.tag}`, true)
          .addField(`\`💾\` Powód`, `\`\`\`diff\n+ ${reason}\n\`\`\``)
          .setTimestamp();
        client.channels.cache
          .get(modlog.channel_modlog)
          .send({ embeds: [sex] });
        message.react("✅");
        client.cooldown_5sec.add(message.author.id);
        setTimeout(() => {
          client.cooldown_5sec.delete(message.author.id);
        }, 5000);
        return;
      }
    } else {
      if (args[0] === message.author.id || args[0] === client.user.id) {
        return message.reply({
          allowedMentions: { repliedUser: false },
          embeds: [
            new MessageEmbed()
              .setColor("#ff0000")
              .setDescription(
                `>>> ${emotki.not} Nie możesz przeprowadzić tej akcji na sobie ani bocie`
              ),
          ],
        });
      }
      const reason1 = args.slice(1).join(" ") || "Brak";
      message.guild.members
        .ban(args[0], { reason: reason1 })
        .then((user) =>
          message.reply({
            allowedMentions: { repliedUser: false },
            embeds: [
              new MessageEmbed()
                .setDescription(
                  `>>> ${emotki.tak} Pomyślnie zbanowałeś **${user.tag}**\n\n\`\`\`diff\n- ${reason1}\n\`\`\``
                )
                .setColor("GREEN")
                .setFooter(
                  `${message.author.tag} | (${message.author.id})`,
                  `${message.author.displayAvatarURL({ dynamic: true })}`
                ),
            ],
            ephemeral: true,
          })
        )
        .catch(message.react("❌"));
      client.cooldown_5sec.add(message.author.id);
      setTimeout(() => {
        client.cooldown_5sec.delete(message.author.id);
      }, 5000);
      return;
    }
  },
};
