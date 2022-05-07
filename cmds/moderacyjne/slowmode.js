const {
  Discord,
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed,
} = require("discord.js");
const emotki = require("../../base/emotki.json");
const ms = require("ms");

module.exports = {
  name: "slow",
  aliases: ["slowmode"],
  category: "moderacyjne",
  description: "Ustawia cooldown na kanale",
  run: async (client, message, args) => {
    if (!message.guild.me.permissions.has("MANAGE_CHANNELS")) {
      return message.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `>>> ${emotki.not} Bot nie ma permisji do wyrzucania **(**\`🔒 MANAGE_CHANNELS\`**)**`
            ),
        ],
      });
    } else if (!message.member.permissions.has("MANAGE_CHANNELS")) {
      return message.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `>>> ${emotki.not} Nie posiadasz permisji do wyrzucania **(**\`🔒 MANAGE_CHANNELS\`**)**`
            ),
        ],
      });
    }

    if (!args[0]) {
      return message.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `>>> ${emotki.not} Poprawny schemat komendy\n\n\`\`\`diff\n+ slow 2h\n+ slow 4m\n+ slow 10s\n\`\`\``
            ),
        ],
      });
    }

    if (ms(args[0]) > 21600000 || ms(args[0]) < 1) {
      return message.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `>>> ${emotki.not} Wybierz czas z podanego przedziału **(** \`1s - 6h\` **)**`
            ),
        ],
      });
    }

    let num = ms(args[0]);
    message.channel.setRateLimitPerUser(ms(args[0]) / 1000);
    message.reply({
      allowedMentions: { repliedUser: false },
      embeds: [
        new MessageEmbed()
          .setColor("GREEN")
          .setDescription(
            `>>> ${emotki.tak} Slowmode na kanale ${
              message.channel
            } został ustawiony na **${ms(num)}**`
          )
          .setFooter(
            `${message.author.tag} | (${message.author.id})`,
            `${message.author.displayAvatarURL({ dynamic: true })}`
          ),
      ],
    });
    message.react("✅");
    client.cooldown_5sec.add(message.author.id);
    setTimeout(() => {
      client.cooldown_5sec.delete(message.author.id);
    }, 5000);
    return;
  },
};
