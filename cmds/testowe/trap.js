const Fetch = require("node-fetch")
const { MessageEmbed, MessageActionRow, MessageButton } = require(`discord.js`);
const emotki = require ("../../base/emotki.json")

module.exports = {
    name : 'ticket',
    category : 'testy',
    run : (client, message, args) => {

        if (!client.config.devs.includes(message.author.id)) {
            return;
        }

        let men_kan = message.guild.channels.cache.get(args[1]) || message.guild.channels.cache.find((x) => x.name === args[1]) || message.mentions.channels.first();

        if (!men_kan) {
            return 
        }


        // const m = await msg.reply({content: "hejka", components: [new Discord.MessageActionRow().addComponents([new Discord.MessageButton().setLabel('kliknij jeśli jebiesz putina').setStyle("PRIMARY").setCustomId('ok')])]})
        // const f1 = (i) => i.customId === 'ok' && i.user.id === msg.author.id;
        // const collector = m.createMessageComponentCollector({ filter: f1, componentType: 'BUTTON', time: 15_000 })
        // collector.on('collect', () => {
        //     msg.channel.send(`${msg.author} jebie putina, za to szacun`)
        // })
        // collector.on('end', collected => m.edit({content: 'teraz to wypierdalaj', components: []}));


        const row = new MessageActionRow().addComponents(new MessageButton()
        .setCustomId('ticket_on').setLabel("🎫 Tiket").setStyle("PRIMARY"))


        const tic = new MessageEmbed()
            .setTitle("Tiket")
            .setDescription("> tiket Corfiego!")
            .setColor("#2f3136")
        men_kan.send({ embeds: [tic], components: [row] })
    }
}




