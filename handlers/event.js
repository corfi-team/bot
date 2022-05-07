const { readdirSync } = require('fs')

module.exports = (client) => {
    const events = readdirSync(`./events/`).filter(file => file.endsWith('.js'))
    for (const file of events) {
        const event = require(`../events/${file}`)
        if (!event) return
        else client.on(file.split('.')[0], (...args) => event.run(client, ...args))
    }
}

