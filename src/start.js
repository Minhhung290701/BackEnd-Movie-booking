const http = require('http')
const chalk = require('chalk')
let debug = console
debug.log(chalk.blue('Environment:'), chalk.green(process.env.NODE_ENV))

const bootstrap = require('./bootstrap')

async function run() {
    try {
        await bootstrap.load()
        const { PORT, HOST } = process.env
        debug = require('./libs/debug')()
        const app = require('./www/app')
        const consummerScanner = require('./consumber-scaner')
        await consummerScanner()

        const server = http.createServer(app.callback())

        server.listen({ port: PORT, host: HOST })

        server.on('listening', () => {
            debug.log(chalk.blue('Server is listening on port:'), chalk.green(PORT))
            debug.log(server.address())
        })

        process.on('SIGINT', () => {
            server.close(() => {
                debug.log('Process terminated')
            })
        })
    } catch (err) {
        debug.error('Occurs error when starting server\n', err)
        debug.error(err)
        console.log(err)
        debug.warn(chalk.yellow('Server is stopping ...'))
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
