const { ShardingManager } = require('discord.js');
const config = require('./config.json');

const manager = new ShardingManager('./app.js', {
    token: config.token ,
    totalShards: 'auto',
});

manager.on('shardCreate', shard => {
    console.log(`Shardy załadowano`)
})

manager.spawn();