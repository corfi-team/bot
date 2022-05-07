const { MessageEmbed } = require("discord.js")
const ImageURLOptions = { format: "png", dynamic: true, size: 1024 };
const emotki = require ('../../base/emotki.json')

module.exports = {
    name : 'poll',
	aliases:[`ankieta`],
    category : 'informacyjne',
    description : 'Tworzy ankiete',
	run : async(client, message, args) => {
			if (!message.member.permissions.has("MANAGE_CHANNELS")) {
				return message.reply({allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Nie posiadasz permisji do zarządzania kanałami **(**\`🔒 MANAGE_CHANNELS\`**)**`)]})
			}
			if(!args[0]){
				const error = new MessageEmbed()
    	        .setColor(`RED`)
    	        .setAuthor(`Poprawne użycie komendy!`,`${message.author.displayAvatarURL({size: 1024, dynamic: true})}`)
    	        .setThumbnail(client.config.z_error)
    	        .setDescription(`\`\`\`poll Czy to najlepszy bot?\npoll Co wolisz & statystyki & levele\`\`\``)
    	    return message.reply({embeds: [error], allowedMentions: { repliedUser: false }});
			}else {
			const reason = args.join(" ").replace(" & ", "&").split("&");
			const anserws = [...reason].slice(1);
			if (anserws.length) {
				let MultiReasonText = "";
				if (anserws.length < 0) return message.reply("Napisz ankiete.");
				if (anserws.length > 10) return message.reply("Liczba pozycji nie może przekraczać 10.");

				anserws.forEach((r, i) => {
					const emoji = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
					if (i === 0) MultiReasonText += `${emoji[i]} - ${r}`;
					if (i > 0) MultiReasonText += `\n${emoji[i]} - ${r}`;
				})
				const embed = new MessageEmbed()
					.setColor("GREEN")
					.setTitle(`📊 ${reason[0]}`)
					.setDescription(MultiReasonText)
					.setFooter(`${message.author.tag} | (${message.author.id})`, `${message.author.displayAvatarURL({dynamic: true})}`)
				message.channel.send({embeds: [embed], allowedMentions: { repliedUser: false } }).then((m) => {
					anserws.forEach(async (r, i) => {
						const emoji = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
						await m.react(emoji[i]);
					})
				})
			} else {
				const embed = new MessageEmbed()
					.setTitle("📊 Ankieta")
					.setDescription(`${reason}`)
					.setColor("GREEN")
					.setFooter(`${message.author.tag} | (${message.author.id})`, `${message.author.displayAvatarURL({dynamic: true})}`);
				message.channel.send({ embeds: [embed], allowedMentions: { repliedUser: false } }).then(e => e.react('👍') + e.react('👎'))
			};
		}
	}
}