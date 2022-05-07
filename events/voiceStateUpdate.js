const { MessageEmbed, WebhookClient,  } = require('discord.js');

exports.run = async (client, oldState, newState) => {
    const user = await client.users.fetch(newState.id)
    const member = newState.guild.members.cache.get(user.id)
    if (!oldState.channel && newState.channelId === '962312697712607243') {
        const channel = await newState.guild.channels.create(`🔈 ${user.tag}`, {
            type: 'GUILD_VOICE',
            parent: newState.channel.parent,
            permissionOverwrites: [
                {
                    id: user.id,
                    allow: ['CONNECT', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS'],
                }
            ]
        })
        member.voice.setChannel(channel)
        voiceCollection.set(user.id, channel.id)
    }

    else if (!newState.channel || newState.voiceChannel === undefined) {
        if (oldState.channelId === voiceCollection.get(newState.id)) {
            if(oldState.channel) oldState.channel.delete()
        }
    } else if (voiceCollection < voiceCollection.get(newState.id)) {
        if (oldState.channelId === voiceCollection.get(newState.id)) {
            if(oldState.channel) oldState.channel.delete()
        }
    } else if (voiceCollection > voiceCollection.get(newState.id)) {
        if (oldState.channelId === voiceCollection.get(newState.id)) {
            if(oldState.channel) oldState.channel.delete()
        }
    }
}

    // else if (oldState.channel) {
    //     console.log(`2`)
    //     const filter = (ch) => (ch.parentId === oldState.parentId) && (ch.type === ChannelType.GuildVoice) && (ch.id != oldState.id) && (oldState.channel.members.size === 0)
    //     return oldState.guild.channels.cache.filter(filter).forEach((c) => c.delete())
    // } 

    // if (oldState.channel) {
    //     const filter = (ch) => (ch.parentId === creator.parentId) && (ch.type === ChannelType.GuildVoice) && (ch.id != creator.id) && (oldStatus.channel.members.size === 0)
    //     return oldState.guild.channels.cache.filter(filter).forEach((c) => c.delete())
    // }  