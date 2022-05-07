const { MessageEmbed } = require('discord.js');
const moment = require('moment-timezone')

exports.run = (client, member) => {
try {
    const base = client.db.prepare('SELECT * FROM member_papa WHERE guild_id = ?').get(member.guild.id)
    const ser = client.db.prepare('SELECT * FROM statystyki WHERE guild_id = ?').get(member.guild.id);

    if (base && base?.channel_id != null ) {
        if (member.guild.channels.cache.get(base.channel_id)) {

            if (base?.powitanie === 'on') {

                const embed = new MessageEmbed()
                    if (base?.kolor != null) embed.setColor(base?.kolor)
                    if (base?.tytul != null) embed.setTitle(base?.tytul.replace(/{tag}/g, `${member.user.tag}`).replace(/{id}/g, `${member.user.id}`).replace(/{liczba}/g, `${member.guild.memberCount}`).replace(/{nazwa}/g, `${member.guild.name}`).replace(/{czas}/g, `${moment(member.user.createdAt).format('L')}`))
                    if (base?.text_embeds != null) embed.setDescription(base?.text_embeds.replace(/{osoba}/g, `${member}`).replace(/{tag}/g, `${member.user.tag}`).replace(/{id}/g, `${member.user.id}`).replace(/{liczba}/g, `${member.guild.memberCount}`).replace(/{nazwa}/g, `${member.guild.name}`).replace(/{czas}/g, `${moment(member.user.createdAt).format('L')}`))
                    if (base?.obraz != null) embed.setImage(base?.obraz)
                    .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
                    .setFooter({text: `${member.user.tag} | (${member.user.id})`, iconURL: `${member.user.displayAvatarURL({dynamic: true})}`})

                    
                if (base?.text != null) {
                    member.guild.channels.cache.get(base.channel_id).send({embeds: [embed], content: base?.text.replace(/{osoba}/g, `${member}`).replace(/{tag}/g, `${member.user.tag}`).replace(/{id}/g, `${member.user.id}`).replace(/{liczba}/g, `${member.guild.memberCount}`).replace(/{nazwa}/g, `${member.guild.name}`).replace(/{czas}/g, `${moment(member.user.createdAt).format('L')}`) })
                }
                else if (!base?.text) {
                    member.guild.channels.cache.get(base.channel_id).send({embeds: [embed]})
                }
            } else if (base?.powitanie === 'off') {
                if (base?.text != null) {
                    member.guild.channels.cache.get(base.channel_id).send({ content: base?.text.replace(/{osoba}/g, `${member}`).replace(/{tag}/g, `${member.user.tag}`).replace(/{id}/g, `${member.user.id}`).replace(/{liczba}/g, `${member.guild.memberCount}`).replace(/{nazwa}/g, `${member.guild.name}`).replace(/{czas}/g, `${moment(member.user.createdAt).format('L')}`) })
                }
            }
        } else {
            client.db.prepare('UPDATE channel_id SET member_add = ? WHERE guild_id = ?').run(null, member.guild.id)
        }
    }


    if (ser) {
        if (ser?.member_add_id && ser?.member_add_id != null) {
            let i = client.db.prepare(`SELECT member_add_ilosc FROM statystyki WHERE guild_id = ?`).get(member.guild.id);
            if(i){
                client.db.prepare('UPDATE statystyki SET member_add_ilosc = ? WHERE guild_id = ?').run(i.member_add_ilosc - 1, member.guild.id);
            }else{
                client.db.prepare(`INSERT INTO statystyki(guild_id, member_add_ilosc) VALUES(?,?)`).run(member.guild.id, "-1");
            }
        }
    }

    return
    } catch (err) {
        embed = new MessageEmbed()
            .setColor('#ff3042')
            .setTitle(`Błąd w event MemberPapa`)
            .setDescription(`\`\`\`js\n${err}\n\`\`\``)
        return client.channels.cache.get(client.config.error).send({ephemeral: true, embeds: [embed]});
    }
}