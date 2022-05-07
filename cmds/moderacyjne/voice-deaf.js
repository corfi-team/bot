const {
  Discord,
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed,
} = require("discord.js");
const emotki = require("../../base/emotki.json");

module.exports = {
  name: "voice-deaf",
  aliases: ["vdeaf"],
  category: "moderacyjne",
  description: "Wygłusza użytkownika na kanale głosowym",
  run: async (client, message, args) => {
    if (!message.guild.me.permissions.has("MUTE_MEMBERS")) {
      return message.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `>>> ${emotki.not} Bot nie posiada permisji do wygłuszania użytkowników **(**\`🔒 MUTE_MEMBERS\`**)**`
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
              `>>> ${emotki.not} Nie posiadasz permisji do wygłuszania użytkowników **(**\`🔒 MUTE_MEMBERS\`**)**`
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
              `>>> ${emotki.not} Poprawny schemat komendy\n\n\`\`\`diff\n+ voice-deaf <@user> [powód]\n+ voice-deaf <User> [powód]\n+ voice-deaf <ID> [powód]\n\`\`\``
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
              `>>> ${emotki.not} Nie możesz wygłuszyć użytkownika o podobnych permisjach`
            ),
        ],
      });
    } else {
      const reason = args.slice(1).join(" ") || "Brak";
      member.voice.setDeaf(true, {
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
          "VOICE-DEAF",
          reason,
          data
        );
      message.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setDescription(
              `>>> ${emotki.tak} Wygłuszyłeś **${member.user.tag}** na kanale głosowym ${member.voice.channel}\n\n\`\`\`diff\n- ${reason}\n\`\`\``
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
        .setAuthor(`🕵️‍♂️ Użytkownik został wygłuszony ${member.user.tag}`)
        .addField(
          `\`💥\` Wygłuszony:`,
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
