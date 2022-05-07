const {
  Discord,
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed,
} = require("discord.js");
const emotki = require("../../base/emotki.json");

module.exports = {
  name: "voice-mute",
  aliases: ["vmute", "voicemute"],
  category: "moderacyjne",
  description: "Wycisza użytkownika na kanale głosowym",
  run: async (client, message, args) => {
    if (!message.guild.me.permissions.has("MUTE_MEMBERS")) {
      return message.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `>>> ${emotki.not} Bot nie posiada permisji do wyciszania na kanale głosowym **(**\`🔒 MUTE_MEMBERS\`**)**`
            ),
        ],
      });
    }
    if (!message.member.permissions.has("MUTE_MEMBERS")) {
      return message.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `>>> ${emotki.not} Nie posiadasz permisji do wyciszania na kanale głosowym **(**\`🔒 MUTE_MEMBERS\`**)**`
            ),
        ],
      });
    }

    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find((m) => m.user.username == args[0]);

    if (!member)
      return message.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `>>> ${emotki.not} Poprawny schemat komendy\n\n\`\`\`diff\n+ voice-mute <@user> [powód]\n+ voice-mute <User> [powód]\n+ voice-mute <ID> [powód]\n\`\`\``
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
    let channel = await member.voice.channel;

    if (!channel) {
      return message.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `>>> ${emotki.not} ${member} nie jest na kanale głosowym`
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
      member.voice.setMute(true, {
        reason: reason,
      });
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
          "VOICE-MUTE",
          reason,
          data
        );
      message.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setDescription(
              `>>> ${emotki.tak} Wyciszyłeś **${member.user.tag}** na kanale głosowym ${member.voice.channel}\n\n\`\`\`diff\n- ${reason}\n\`\`\``
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
      if (!modlog?.channel_modlog) return;

      const sex = new MessageEmbed()
        .setColor(`2f3136`)
        .setAuthor(
          `🕵️‍♂️ Użytkownik został wyciszony na kanale głosowym ${member.user.tag}`
        )
        .addField(
          `\`💥\` Wyciszono:`,
          `${member.user.tag} \`(${member.id})\``,
          true
        )
        .addField(`\`🔱\` Moderator:`, `${message.author.tag}`, true)
        .addField(`\`💾\` Powód`, `\`\`\`diff\n+ ${reason}\n\`\`\``)
        .setTimestamp();
      client.channels.cache
        .get(modlog.channel_modlog)
        .send({ embeds: [modlog] });
      message.react("✅");
      client.cooldown_5sec.add(message.author.id);
      setTimeout(() => {
        client.cooldown_5sec.delete(message.author.id);
      }, 5000);
      return;
    }
  },
};
