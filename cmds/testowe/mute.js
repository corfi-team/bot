const { MessageEmbed } = require("discord.js");
const emotki = require("../../base/emotki.json");

module.exports = {
  name: "off_mute",
  category: "moderacyjne",
  description: "Wycisza użytkownika",
  run: async (client, message, args) => {
    if (!message.guild.me.permissions.has("MANAGE_ROLES")) {
      return message.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `>>> ${emotki.not} Bot nie ma permisji do wyciszania użytkowników **(**\`🔒 MANAGE_ROLES\`**)**`
            ),
        ],
      });
    } else if (!message.member.permissions.has("KICK_MEMBERS")) {
      return message.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `>>> ${emotki.not} Nie posiadasz permisji do wyciszania użytkowników **(**\`🔒 KICK_MEMBERS\`**)**`
            ),
        ],
      });
    }

    const baza = client.db
      .prepare("SELECT mute_role FROM serwer WHERE guild_id = ?")
      .get(message.guild.id);
    if (!baza.mute_role) {
      return message.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `>>> ${emotki.not} Rola dla wyciszonych użytkowników nie została ustawiona **(** \`🔒 set muterole\` **)**`
            ),
        ],
      });
    }
    const rola = message.guild.roles.cache.get(baza.mute_role);
    if (!rola) {
      return message.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `>>> ${emotki.not} Rola dla wyciszonych użytkowników nie została znaleziona **(** \`🔒 set muterole\` **)**`
            ),
        ],
      });
    }

    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find((m) => m.user.username == args[0]);

    if (!member || !member.user.tag)
      return message.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `>>> ${emotki.not} Poprawny schemat komendy\n\n\`\`\`diff\n+ mute <@user> [powód]\n+ mute <User> [powód]\n+ mute <ID> [powód]\n\`\`\``
            ),
        ],
      });

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
              `>>> ${emotki.not} Nie możesz wyciszyć użytkownika o podobnych permisjach`
            ),
        ],
      });
    } else {
      const reason = args.slice(1).join(" ") || "Brak";
      member.roles.add(rola);
      const days = [
        "Niedziela",
        "Poniedzialek",
        "Wtorek",
        "Sroda",
        "Czwartek",
        "Piatek",
        "Sobota",
      ];
      const now = new Date();
      const data =
        days[now.getDay()] +
        " " +
        now.getDate() +
        " " +
        now.getMonth() +
        " " +
        now.getFullYear() +
        " | " +
        now.getMinutes() +
        " " +
        now.getHours();
      client.db
        .prepare(
          "INSERT INTO history(user_id, guild_id, mod_id, action, reason, data) VALUES(?,?,?,?,?,?)"
        )
        .run(
          member.id,
          message.guild.id,
          message.author.id,
          "MUTE",
          reason.substring(0, 400) || `Brak`,
          data
        );
      message.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setDescription(
              `>>> ${emotki.tak} Pomyślnie wyciszyłeś **${member.user.tag}**\n\n\`\`\`diff\n- ${reason}\n\`\`\``
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
        .setAuthor(`🔇 Użytkownik został wyciszony ${member.user.tag}`)
        .addField(
          `\`💥\` Wyciszony:`,
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
    }
  },
};
