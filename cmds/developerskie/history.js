const { MessageEmbed } = require("discord.js");
const emotki = require("../../base/emotki.json");

module.exports = {
  name: "history",
  category: "developerskie",
  description: "Wyświetla listę ostrzeżeń użytkownika",
  run: async (client, message, args) => {
    const modlog = new MessageEmbed()
      .setColor(`2f3136`)
      .setAuthor(
        `🕵️‍♂️ Zbanowany ${message.author.tag}`,
        `${message.author.displayAvatarURL({ size: 1024, dynamic: true })}`
      )
      .addField(`\`💥\` Dostał:`, `ktoś`, true)
      .addField(`\`🔱\` Moderator:`, `ktoś`, true)
      .addField(`\`💾\` Powód`, `\`\`\`diff\n+ powód\n\`\`\``)
      .setTimestamp();
    message.reply({ embeds: [modlog] });
  },
};
