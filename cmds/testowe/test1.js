const { MessageEmbed, MessageActionRow, MessageButton, MessageReaction } = require(`discord.js`);
const fetch = require('node-fetch')
const ms = require('ms');

module.exports = {
    name : 'test',
    category : 'testy',
    run : async (client, message, args) => {

        const menu = {
            kot : 'kotek',
            pies : 'piesek'
        }

        let i = client.db.prepare(`SELECT test1 FROM testy WHERE guild_id = ?`).get(message.guild.id);
        if(i){
            client.db.prepare('UPDATE testy SET test1 = ? WHERE guild_id = ?').run(menu, message.guild.id);
        }else{
            client.db.prepare(`INSERT INTO testy(guild_id, test1) VALUES(?,?)`).run(message.guild.id, menu);
        }

        // const yes = new MessageEmbed()
        //     .setTitle("Weryfikacja")
        //     .setDescription("> Aby się zweryfikować, kliknij w przycisk pod wiadomością!")
        //     .setFooter({text: message.guild.name,  iconURL: message.guild.iconURL({ dynamic: true }) || client.user.displayAvatarURL({ })})
        //     .setColor(client.config.color)
        // message.guild.channels.cache.get("962345467092545587").send({embeds: [yes]}).then(emb => {
        //     console.log(emb.id)
        // })


// let kolor = "5af542"
//         const res = await fetch(`https://api.alexflipnote.dev/color/${kolor}`, {
// 			method: 'GET',
//             headers: {
//                 'Authorization': "ODIzNDUyODY4OTUwNDkxMTc2.YFhCPg.QT62AV5vfvwaLfhpkx6Rv61YxcY"
//             },
//         }).then(res => res.json()).catch(r => {
//             return console.log(`1`)
// 		})
//         console.log(res.name)

        // const argument_1 = 'rola1;rola2;rola3'
        // const data = argument_1.split(';')

        // for (let i = 0; i < data.length - 1;) {
        //     if (!message.guild.roles.cache.get(men_role.id)) {
        //         return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`>>> ${emotki.not} Oznacz rolę dla osoby, która dołączyła\n\`\`\`diff\n+ Pamiętaj, że rola bota musi być na rolą, którą oznaczyłeś!\n\`\`\``).setThumbnail(client.config.ustaw)]})
        //     }
        // }

        // let kocen = "";
        // men_role.forEach(rola => {
        //     kocen += `${rola},`
        // });

        // console.log(kocen)
        // const dwa = kocen.split(',')
        // console.log(dwa)

        // return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`${kocen}\n ${dwa}`)]})
        // let men_role =  message.mentions.roles
        // const coś = men_role
        // console.log(`0`)
        // // const data = coś.split(';')
        // console.log(`1`)
        // let wiad = ''
        // for (let i = 0; i < men_role.length - 0;) {
        //     console.log(`1.2`)

        //     wiad += `${men_role}`
        //     console.log(`1.3`)

        // }
        // console.log(`2`)
        // console.log(wiad)
        // message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(wiad)]})


    }
}