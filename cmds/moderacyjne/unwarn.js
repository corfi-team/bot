const { MessageEmbed } = require("discord.js");
const emotki = require("../../base/emotki.json");

module.exports = {
  name: "unwarn",
  aliases: ["uw"],
  category: "moderacyjne",
  description: "Usuwa ostrzeżenie",
  run: async (client, message, args) => {
    if (!message.member.permissions.has("KICK_MEMBERS")) {
      return message.reply({
        allowedMentions: { repliedUser: false },
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
                `>>> ${emotki.not} Poprawny schemat komendy\n\n\`\`\`diff\n+ unwarn <@user> <CASE>\n+ unwarn <User> <CASE>\n+ unwarn <ID> <CASE>\n\`\`\``
              ),
          ],
        });
    }

    let numer = args[1];
    if (!numer) {
      return message.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("#ff0000")
            .setDescription(`>>> ${emotki.not} Podaj numer ostrzeżenia`),
        ],
      });
    }
    if (isNaN(numer)) {
      return message.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("#ff0000")
            .setDescription(
              `>>> ${emotki.not} Podano błędny numer ostrzeżenia`
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
              `>>> ${emotki.not} Nie możesz usunąć ostrzeżeń użytkownika o podobnych permisjach`
            ),
        ],
      });
    }

    const baza = client.db
      .prepare("SELECT * FROM warns WHERE numer = ? AND user_id = ?")
      .get(parseInt(numer), member.id);
    if (!baza.numer) {
      if (err)
        return message.reply({
          allowedMentions: { repliedUser: false },
          embeds: [
            new MessageEmbed()
              .setColor("#ff0000")
              .setDescription(
                `>>> ${emotki.not} Ostrzeżenie o podanym numerze nie istnieje dla tego użytkownika`
              ),
          ],
        });
    } else {
      let del = client.db
        .prepare("DELETE FROM warns WHERE numer = ?")
        .run(parseInt(numer));
      if (!del.changes)
        return message.reply({
          allowedMentions: { repliedUser: false },
          embeds: [
            new MessageEmbed()
              .setColor("#ff0000")
              .setDescription(`>>> ${emotki.not} Coś poszło nie tak...`),
          ],
        });
      message.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setDescription(
              `>>> ${emotki.tak} Usunąłeś ostrzeżenie ${parseInt(
                numer
              )} dla **${member.user.tag}**`
            )
            .setColor("GREEN")
            .setFooter(
              `${message.author.tag} | (${message.author.id})`,
              `${message.author.displayAvatarURL({ dynamic: true })}`
            ),
        ],
      });

      const modlog = client.db
        .prepare("SELECT * FROM serwer WHERE guild_id = ?")
        .get(message.guild.id);
      if (!modlog.channel_modlog) return;

      const sex = new MessageEmbed()
        .setColor(`2f3136`)
        .setAuthor(`🕵️‍♂️ Usunięto ostrzeżenie użytkownikowi ${member.user.tag}`)
        .addField(
          `\`💥\` Użytkownik:`,
          `${member.user.tag} \`(${member.id})\``,
          true
        )
        .addField(`\`🔱\` Moderator:`, `${message.author.tag}`, true)
        .addField(`\`💾\` Ostrzeżenie`, `\`\`\`diff\n+ ${numer}\n\`\`\``)
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
