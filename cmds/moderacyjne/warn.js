const { MessageEmbed } = require("discord.js");
const emotki = require("../../base/emotki.json");

module.exports = {
  name: "warn",
  aliases: ["w"],
  category: "moderacyjne",
  description: "Ostrzega użytkownika",
  run: async (client, message, args) => {
    if (!message.member.permissions.has("KICK_MEMBERS")) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `>>> ${emotki.not} Nie posiadasz permisji do ostrzegania użytkowników **(**\`🔒 KICK_MEMBERS\`**)**`
            ),
        ],
      });
    }

    let member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find((m) => m.user.username == args[0]);

    if (!member || member.bot) {
      if (!args[0])
        return message.reply({
          allowedMentions: { repliedUser: false },
          embeds: [
            new MessageEmbed()
              .setColor("#ff0000")
              .setDescription(
                `>>> ${emotki.not} Poprawny schemat komendy\n\n\`\`\`diff\n+ warn <@user> [powód]\n+ warn <User> [powód]\n+ warn <ID> [powód]\n\`\`\``
              )
              .setFooter(
                "Nie można ostrzec bota",
                client.user.displayAvatarURL()
              ),
          ],
        });
    }

    if (member.id === message.author.id || member.id === client.user.id) {
      return message.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("#ff0000")
            .setDescription(
              `>>> ${emotki.not} Nie możesz ostrzec siebie ani bota`
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
              `>>> ${emotki.not} Nie możesz ostrzec użytkownika o podobnych permisjach`
            ),
        ],
      });
    }

    const reason = args.slice(1).join(" ") || "Brak";
    if (reason.length > 300) returnreason.slice(0, 300);

    client.db
      .prepare(
        "INSERT INTO warns(user_id, mod_id, guild_id, reason) VALUES(?,?,?,?)"
      )
      .run(member.id, message.author.id, message.guild.id, reason);
    message.reply({
      allowedMentions: { repliedUser: false },
      embeds: [
        new MessageEmbed()
          .setDescription(
            `>>> ${emotki.tak} Pomyślnie ostrzegłeś **${member.user.tag}**\n\n\`\`\`diff\n- ${reason}\n\`\`\``
          )
          .setColor("GREEN")
          .setFooter(
            `${message.author.tag} | (${message.author.id})`,
            `${message.author.displayAvatarURL({ dynamic: true })}`
          ),
      ],
    });

    const modlog = client.db
      .prepare("SELECT channel_modlog FROM serwer WHERE guild_id = ?")
      .get(message.guild.id);
    if (!modlog.channel_modlog) return;
    const sex = new MessageEmbed()
      .setColor(`2f3136`)
      .setAuthor(`🕵️‍♂️ Użytkownik został ostrzeżony ${member.user.tag}`)
      .addField(
        `\`💥\` Użytkownik:`,
        `${member.user.tag} \`(${member.id})\``,
        true
      )
      .addField(`\`🔱\` Moderator:`, `${message.author.tag}`, true)
      .addField(`\`💾\` Powód`, `\`\`\`diff\n+ ${reason}\n\`\`\``)
      .setTimestamp();
    client.channels.cache.get(modlog.channel_modlog).send({ embeds: [sex] });
    message.react("✅");
    client.cooldown_5sec.add(message.author.id);
    setTimeout(() => {
      client.cooldown_5sec.delete(message.author.id);
    }, 5000);
    return;
  },
};
