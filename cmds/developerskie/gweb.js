const { MessageEmbed, WebhookClient } = require('discord.js');

module.exports = {
    name : 'changelog',
    aliases: ['chlg'],
    category : 'developerskie',
    description : 'Wysyła changelog na kanał',
    run : async(client, message, args) => {

		if (!client.config.devs.includes(message.author.id)) return


		const content = args.slice(0).join(" ");

		let akt = content.split(" |")[0];
	 
		let add = content.split(" |")[1];
	 
		let zmie = content.split(" |")[2];

		let usun = content.split(" |")[3];

		let embed = new MessageEmbed()
		    .setColor(`#cc0033`)
		    .setTitle(`${akt}`)
		    .addField(`Dodano`, `>>> ${add || `Brak`}`)
		    .addField(`Zmiany`, `>>> ${zmie || `Brak`}`)
		    .addField(`Usunięte`, `>>> ${usun || `Brak`}`)
		    .setFooter(`${message.author.tag} | ${message.author.id}`, message.author.displayAvatarURL({ dynamic: true }));

		message.channel.createWebhook(`Changelog`,{
            avatar: message.guild.iconURL({ dynamin: true, format: `png`})
        }).then(wehbook => {
            wehbook.send({embeds: [embed]}).then(() => {
                wehbook.delete()
            })
        })
    }
}