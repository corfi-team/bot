const {Collection, Client, WebhookClient, MessageEmbed} = require('discord.js')
const { GiveawaysManager } = require('discord-giveaways');
const config = require('./config.json');
const fs = require('fs');
const e = require('./base/emotki.json');
const { AutoPoster } = require('topgg-autoposter')

const client = new Client({
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
    intents: [
        "GUILDS",
        "GUILD_BANS",
        "GUILD_INTEGRATIONS",
        "GUILD_WEBHOOKS",
        "GUILD_VOICE_STATES",
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_MEMBERS"
        // "GUILD_PRESENCES"
    ],
});


// const ap = AutoPoster('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgxMzY3NDgzNjM5OTYyMDEyNiIsImJvdCI6dHJ1ZSwiaWF0IjoxNjM1MjgyMTA2fQ.YypCDhgyr-PUbXafCwaXaX_QTA7oDd3cWVKbTkDYrJs', client)
// ap.on('posted', () => {
//   console.log('TOP.GG')
// })


client.config = require("./config.json");
global.client = client;
global.voiceCollection = new Collection();

const manager = new GiveawaysManager(client, {
    storage: './giveaways.json',
    default: {
        botsCanWin: false,
        embedColor: client.config.color,
        embedColorEnd: '#ff0059',
        reaction: `⭐`
    },
    messages: {
        giveaway: `${e.konk} Rozpocząto losowanie`,
        giveawayEnded: `${e.stop} Zakończono losowanie`,
        drawing: `${e.time} Pozostało: {timestamp}`,
        dropMessage: `Weź udział jako pierwszy ${e.koronka}`,
        inviteToParticipate: `Naciśnij ${e.koronka} aby wziąć udział!`,
        winMessage: `${e.bust} **Gratulacje,** {winners}!\n🎁 **Nagroda:** **{this.prize}**!\n:link: {this.messageURL}`,
        embedFooter: `${e.arrow_join} Przewidziano nagrody dla {this.winnerCount} zwycięzcy(ów)`,
        noWinner: `${e.wumpus} **Losowanie zostało zakończone**, ale nie znalazłem nikogo kto mógłby je wygrać!`,
        hostedBy: '💸 Sponsor: {this.hostedBy}',
        winners: 'Zwycięzca(y):',
        endedAt: 'Czas:',
    }
});

manager.on('giveawayRerolled', (giveaway, winners) => {
    winners.forEach((member) => {
        return member.send({ embeds: [new MessageEmbed().setColor("GREEN").setDescription(`:tada: **Gratulacje** ${member.user.tag}, wygrałeś **${giveaway.prize}**!`).setFooter(`Na serwerze ${client.guilds.cache.get(giveaway.guildId).name}`, client.guilds.cache.get(giveaway.guildId).iconURL())]});
    });
});
manager.on('giveawayReactionAdded', (giveaway, member, reaction) => {
    return member.send({ embeds: [new MessageEmbed().setColor("GREEN").setDescription(`:white_check_mark: Bierzesz udział w losowaniu o ***${giveaway.prize}*** na serwerze ***${client.guilds.cache.get(giveaway.guildId).name}***`)]})
});
manager.on('giveawayEnded', (giveaway, winners) => {
    winners.forEach((member) => {
        return member.send({ embeds: [new MessageEmbed().setColor("GREEN").setDescription(`:tada: **Gratulacje** ${member.user.tag}, wygrałeś **${giveaway.prize}**!`)]});
    });
});
manager.on('endedGiveawayReactionAdded', (giveaway, member, reaction) => {
    return reaction.users.remove(member.user);
});

// process.on('unhandledRejection' , err => {
//     console.log(`coś nie poszło ${err}`)
// })


client.on("shardReady", async s => {
    console.log(`Shard #${s} jest obenie: ${client.guilds.cache.size} serwerów!`)
})

client.on("shardDisconnect", async s => {
    console.log(`Shard #${s} rozłączono shardy`)
})

client.on("shardReconnecting", async s => {
    console.log(`Shard #${s} łączenie`)
})


client.db = require('better-sqlite3')('./database.db')
client.giveawaysManager = manager;
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./cmds/");
client.tb = require("./break.json");
client.settings = new Collection();
client.cooldown_5sec = new Set();

['./handlers/event.js', './handlers/settings.js', './handlers/command.js'].forEach(x => require(x)(client))

client.login(config.token)
