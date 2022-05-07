const {
  Discord,
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed,
} = require("discord.js");
const emotki = require("../../base/emotki.json");

module.exports = {
  name: "voice-mute-all",
  aliases: ["vmute-all"],
  category: "moderacyjne",
  description: "Wycisza wszystkich na kanale głosowym",
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
    if (!message.member.permissions.has("ADMINISTRATOR")) {
      return message.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `>>> ${emotki.not} Nie posiadasz permisji do wyciszania na kanale głosowym **(**\`🔒 ADMINISTRATOR\`**)**`
            ),
        ],
      });
    }

    const channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]) ||
      message.guild.channels.cache.find((c) => c.name == args[0]);

    if (!channel)
      return message.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `>>> ${emotki.not} Poprawny schemat komendy\n\n\`\`\`diff\n+ voice-mute-all <@channel>\n+ voice-mute-all <Channel>\n+ voice-mute-all <ID>\n\`\`\``
            ),
        ],
      });

    if (channel.type !== "GUILD_VOICE") {
      return message.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `>>> ${emotki.not} Oznaczony kanał nie jest kanałem głosowym`
            ),
        ],
      });
    }

    if (channel.members < 1) {
      return message.reply({
        allowedMentions: { repliedUser: false },
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `>>> ${emotki.not} Na tym kanale głosowym nikogo nie ma`
            ),
        ],
      });
    }
    const count = 0;
    for (let member of channel.members) {
      member[1].voice.setMute(true);
      count++;
    }
    message.reply({
      allowedMentions: { repliedUser: false },
      embeds: [
        new MessageEmbed()
          .setDescription(
            `>>> ${emotki.tak} Wyciszyłeś **${count}** osób na kanale głosowym ${channel}`
          )
          .setColor("GREEN")
          .setFooter(
            `${message.author.tag} | (${message.author.id})`,
            `${message.author.displayAvatarURL({ dynamic: true })}`
          ),
      ],
      ephemeral: true,
    });
    message.react("✅");
    client.cooldown_5sec.add(message.author.id);
    setTimeout(() => {
      client.cooldown_5sec.delete(message.author.id);
    }, 5000);
    return;
  },
};
