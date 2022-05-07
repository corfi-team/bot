const { MessageEmbed } = require("discord.js")
const moment = require('moment-timezone')
const emotki = require ('../../base/emotki.json')

module.exports = {
    name : 'server',
	aliases:[`guild`, "serverinfo", "serwer"],
    category : 'informacyjne',
    description : 'Informacje o serwerze',
    run : async(client, message, args) => {

    moment.locale(`pl`);

    const filterLevels = {
        DISABLED: 'Wyłączona',
        MEMBERS_WITHOUT_ROLES: 'Bez roli',
        ALL_MEMBERS: 'Wszyscy'
    };
    const verificationLevels = {
        NONE: 'Brak',
        LOW: 'Niska',
        MEDIUM: 'Średnia',
        HIGH: '(╯°□°）╯︵ ┻━┻',
        VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
    };
    const tiers = {
        NONE: "Brak"
    }

    let szyscy = message.guild.memberCount
    let boty = message.guild.members.cache.filter((member) => member.user.bot).size
    let users = szyscy - boty


    message.reply({ allowedMentions: { repliedUser: false }, embeds: [new MessageEmbed()
        .setColor(client.config.color)
        .setThumbnail(message.guild.iconURL({ dynamic: true, size: 512 }))
        .addField(`>>> ${emotki.edit} **Nazwa:**`, `\`${message.guild.name}\``, true)
        .addField(`>>> ${emotki.pad} **ID:**`, `\`${message.guild.id}\``, true)
        .addField(`>>> ${emotki.koronka} **Właściciel:**`, `<@${message.guild.ownerId}>`, true)
        .addField(`>>> ${emotki.edit} **Opis:**`, `\`${message.guild.description || 'Brak'}\``, true)
        .addField(`>>> ${emotki.arrow_join} **Banner:**`, `[Kliknij](${message.guild.bannerURL() || "https://cdn.discordapp.com/avatars/813674836399620126/44ef30039273e90c4805453f83cd5b8c.webp?size=1024"})`, true)
        .addField(`>>> ${emotki.moderator} **Shard:**`, `\`${message.guild.shardId}\``, true)
        .addField(`>>> \`🎈\` **Tier:**`, `\`${tiers[message.guild.premiumTier]}\``, true)
        .addField(`>>> \`🧶\` **Filtr:**`, `\`${filterLevels[message.guild.explicitContentFilter]}\``, true)
        .addField(`>>> ${emotki.arrow_join} **Weryfikacja:**`, `\`${verificationLevels[message.guild.verificationLevel]}\``, true)
        .addField(`>>> ${emotki.support} **Role:**`, `\`${message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString()).length}\``, true)
        .addField(`>>> \`💢\` **Emotki:**`, `\`${message.guild.emojis.cache.size}\``, true)
        .addField(`>>> \`👥\` **Użytkownicy:**`, `\`${szyscy}\``, true)
        .addField(`>>> \`🙍‍♂️\` **Ludzie:**`, `\`${users}\``, true)
        .addField(`>>> ${emotki.bot} **Boty:**`, `\`${boty}\``, true)
        .addField(`>>> ${emotki.channel} **Tekstowe:**`, `\`${message.guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').size}\``, true)
        .addField(`>>> ${emotki.glosowy} **Głosowe:**`, `\`${message.guild.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').size}\``, true)
        .addField(`>>> ${emotki.bust} **Boosty:**`, `\`${message.guild.premiumSubscriptionCount || '0'}\``, true)
        .addField(`>>> ${emotki.edit1} **Utworzono:**`, `\`${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')}\` \`(${moment(message.guild.createdTimestamp).fromNow()})\``, true)], allowedMentions: { repliedUser: false } });
        client.cooldown_5sec.add(message.author.id);
        setTimeout(() => {
          client.cooldown_5sec.delete(message.author.id);
        }, 5000);
        return;
    }
}