const Promise = require('bluebird')
//const mysql = require('./mysql')
const mongodb = require('./mongodb')
const redis = require('./redis')
const chalk = require('chalk')

const dbs = {
    //mysql,
    mongodb,
    redis
}

Object.keys(dbs).forEach(key => {
    exports[key] = dbs[key]
})

const { STARTING_TIMEOUT } = process.env
const WAITING_TIME = 1000 // ms

let timeCounting = 0

exports.initConnections = async () => {
    if (timeCounting > STARTING_TIMEOUT) {
        console.log(chalk.red('Cannot connect to db'))
        throw new Error('Cannot start')
    }

    let isConnected = true
    await Promise.all(
        Object.keys(dbs).map(async dbName => {
            const result = await dbs[dbName].checkConnection()
            if (!result.connected) {
                isConnected = false
                console.log(chalk.yellow('Waiting for connection to ' + dbName))
            }

            return
        }),
    )

    if (!isConnected) {
        timeCounting += WAITING_TIME
        await Promise.delay(WAITING_TIME)
        return exports.initConnections()
    }

    return true
}

exports.mongodb = mongodb
exports.redis = redis
