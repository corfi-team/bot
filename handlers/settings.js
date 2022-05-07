const { readdirSync } = require(`fs`);
module.exports = async (client) => {
    readdirSync(`./settings/`).map(setting=>{
        let pull = require(`../settings/${setting}`)
        client.settings.set(pull.name, pull)
    })
}