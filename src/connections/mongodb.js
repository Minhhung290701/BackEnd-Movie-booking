const mongoose = require('mongoose')
const chalk = require('chalk')
const debug = require('../libs/debug')()

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */
const { MONGODB_CONNECTION_STRING, MONGODB_DEFAULT_DB } = process.env
let isConnected = false

mongoose.connect(MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
    // autoIndex: true,
    autoIndex: ['staging', 'development'].includes(process.env.NODE_ENV),
})

const { connection: conn } = mongoose

conn.on('connected', () => {
    debug.info(chalk.blue('Connected to MongoDB'))
    isConnected = true
})

conn.on('disconnected', () => {
    debug.info(chalk.red('Disconnected to MongoDB'))
    isConnected = false
})

conn.on('error', console.error.bind(console, 'MongoDB connection error:'))

mongoose.Promise = global.Promise

module.exports = {
    DefaultDB: mongoose.connection.useDb(MONGODB_DEFAULT_DB),
    connection: conn,
    checkConnection: async () => ({
        connected: await Promise.resolve(isConnected),
    })
}

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection is disconnected due to application termination')
    })
})
