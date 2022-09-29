const configs = require('./configs') // init config. this line must to be on top required.
const connections = require('./connections')

exports.load = async () => {
    await configs.load()
    await connections.initConnections()

    return
}
