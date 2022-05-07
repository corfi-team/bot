const {
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed,
} = require("discord.js");
const e = require("../../base/emotki.json");

module.exports = {
  name: "help",
  aliases: ["cmd", "cmds", "pomoc"],
  category: "informacyjne",
  timeout: 5000,
  description: "Wyświetla spis komend",
  run: async (client, message, args) => {
    module.exports = {
      typek: message.author.id,
    };
    const help = args[0];
    if (!help) {
      const embed = new MessageEmbed()
        .setColor(client.config.color)
        .setAuthor({
          name: "Dostępne komendy bota Corfi",
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(
          `${e.arrow_join} **Wybierz odpowiednią kategorię komend bota**`
        );
      const menu = new MessageSelectMenu()
        .setCustomId("help")
        .setPlaceholder("Wybierz kategorię!")
        .addOptions([
          {
            label: "Moderacyjne",
            description: "Komendy moderacyjne",
            emoji: e.edit,
            value: "moderacyjne",
          },
          {
            label: "Informacyjne",
            description: "Komendy informacyjne",
            emoji: e.klucz,
            value: "informacyjne",
          },
          {
            label: "Konkursy",
            description: "Komendy konkursowe",
            emoji: e.konk,
            value: "konkursowe",
          },
        ]);
      const row = new MessageActionRow().addComponents(menu);
      message.reply({ embeds: [embed], components: [row] }).then((send) => {
        setTimeout(function () {
          send.edit({ components: [] });
        }, 180000);
      });
    } else {
      const clientCommand =
        client.commands.get(help) ||
        client.commands.find((a) => a.aliases && a.aliases.includes(help));
      if (!clientCommand || !clientCommand.name) return message.react(`❌`);

      const aliasy = clientCommand.aliases
        ? clientCommand.aliases.join(`, `)
        : "Brak";

      const opiskom = {
        informacyjne: "🌍",
        moderacyjne: "🧩",
        konkursowe: "🎁",
        developerskie: "👀",
        testy: "😈",
        leveling: "⬆"
      };

      const cmdinfo = new MessageEmbed()
        .setColor("dc143c")
        .setAuthor({ name: `🧪 Informacje o komendzie` })
        .addField("> `🧩` Nazwa:", `\`\`\`${clientCommand.name}\`\`\``, true)
        .addField(
          "> `📚` Kategoria:",
          `\`\`\`${opiskom[clientCommand.category]} ${
            clientCommand.category || "Brak"
          }\`\`\``,
          true
        )
        .addField("> `📣` Aliasy:", `\`\`\`${aliasy}\`\`\``)
        .addField(
          "> `💣` Opis:",
          `\`\`\`${clientCommand.description || "Brak"}\`\`\``
        )
        .addField(
          "> `✍` Użycie:",
          `\`\`\`${clientCommand.uzycie || "Nie podane"}\`\`\``
        )
        .setFooter({
          text: `${message.author.tag} | (${message.author.id})`,
          iconURL: `${message.author.displayAvatarURL({ dynamic: true })}`,
        });
      return message.reply({ embeds: [cmdinfo] });
    }
  },
};
