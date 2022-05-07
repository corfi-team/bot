const { MessageEmbed, WebhookClient } = require('discord.js');

exports.run = (client, g) => {
try{
    const avatar = g.iconURL({ dynamic: true }) || `https://cdn.discordapp.com/attachments/893917151843454986/898903397707685898/tyu.png`

    const webhookClient = new WebhookClient({ url: `${client.config.add}`});

    embed = new MessageEmbed()
        .setColor('#00e8ff')
        .setTitle('Dodano bota!')
        .setThumbnail(`${avatar}`)
        .addField("Serwer", `${g.name} || \`${g.id}\``)
        .addField('Właściciel', `<@${g.ownerId}> || \`${g.ownerId}\``)
        .addField("Ilość osób", `\`${g.memberCount}\``, true )
        .addField("Ilość serv",`\`${client.guilds.cache.size}\``, true)

    webhookClient.send({
    	username: `${g.name}`,
    	avatarURL: `${avatar}`,
    	embeds: [embed],
    });

}catch (err){
    embed = new MessageEmbed()
        .setColor('#ff3042')
        .setTitle(`Błąd w event Dodanie bota`)
        .setDescription(`\`\`\`js\n${err}\n\`\`\``)
    return client.channels.cache.get(client.config.error).send({embeds: [embed]});
    }
};