const chalk = require('chalk')
// let debug = console
// debug.log(chalk.blue('Environment:'), chalk.green(process.env.NODE_ENV))

const bootstrap = require('./bootstrap')

const run = async () => {
    try {
        await bootstrap.load()
        // debug = require('./libs/debug')()
        const rabbitMq = require('./connections/rabbit-mq')

        const QUEUE_NAME = '/chat/room'

        const n = {
          id: '123123'
        }
        const result = await rabbitMq.rpcCall(QUEUE_NAME)('getRoomById', n)

        console.log(' [x] Requesting', n)
        console.log(' [.] Got', result.data)
        return result.data
        process.on('SIGINT', () => {
            console.log('exit')
            process.exit(0)
        })
    } catch (err) {
        // debug.error('Occurs error when starting server\n', err)
        // debug.error(err)
        console.log(err)
        // debug.warn(chalk.yellow('Server is stopping ...'))
        process.exit(1)
    }
}

run()

process.on('uncaughtException', error => {
    debug.error('Uncaught Exception: ', error)
})

process.on('unhandledRejection', (reason, p) => {
    debug.error('Unhandled Rejection at: Promise', p, 'reason:', reason)
})