const { MessageEmbed, WebhookClient } = require('discord.js');

// exports.run = (client, err) => {
//     console.log(err)
//     const embed = new MessageEmbed()
//         .setColor('#ff3042')
//         .setTitle(`Błąd`)
//         .setDescription(`\`\`\`js\n${err}\n\`\`\``)
//     return client.channels.cache.get(client.config.error).send({embeds: [embed]});
// };