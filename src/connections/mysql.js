const knex = require('knex')
const chalk = require('chalk')
const debug = require('../libs/debug')()

const {MYSQL_CONNECTION_STRING} = process.env
let isConnected = false

const options = {
    client: 'mysql2',
    connection: MYSQL_CONNECTION_STRING,
}


const knexConnection = knex(options)

knexConnection.raw('select 1 as result')
    .then( ()=> {
        isConnected = true
        debug.info(chalk.blue('Connected to MySQL'))
    })
    .catch( ()=> {
        isConnected = false
        debug.info(chalk.red('Disconnected to MySQL'))
    });



module.exports = {
    checkConnection: async () => ({
        connected: await Promise.resolve(isConnected),
    }),
    knexConnection
}