/* eslint-disable func-names */
const debug = require('debug')('app')
const path = require('path')
const StackTrace = require('stacktrace-js')
const axios = require('axios')
const util = require('util')

const logger = require('./logger')

async function print(level, namespace, ...args) {
    const { lineNumber, columnNumber, functionName } = StackTrace.getSync()[2]
    const fn = functionName === 'NativeConnection.<anonymous>' ? '' : `#${functionName}`
    const writer = debug.extend(level).extend(`/${namespace}${fn}:${lineNumber}:${columnNumber}`)

    writer(...args)
    const _args = args.map(e => (typeof e === 'string' ? e.replace(/%/g, '`0|0') : e))
    Promise.resolve(logger.log(level === 'log' ? 'info' : level, ..._args)).catch(error =>
        console.error('Cannot write log to file', error),
    )
    if (process.env.LOG_URL) {
        const checkkeys = args[0]
        var keys = []
        if (typeof checkkeys == 'string' && checkkeys.indexOf('keys:') == 0) {
            const stringkeys = checkkeys.slice(5, checkkeys.length)
            keys = stringkeys.split(',')
        }
        const entity = {
            app: process.env.APP_NAME,
            service: process.env.SERVICE_NAME,
            level: level,
            keys: keys,
            namespace: namespace,
            log: util.inspect(_args, { depth: null }),
        }

        axios.post(process.env.LOG_URL, entity).catch(err => {
            console.error(err.message)
            console.error(util.inspect(err.response.data, { compact: false, depth: null }))
        })
    }
}

/**
 * Init debug instance
 * @param String __filename the file path, which call debug
 */
function Debug() {
    const stackLine = StackTrace.getSync()[2]
    const pathFile = stackLine.fileName
    const dirname = path.dirname(pathFile)
    const filename = path.basename(pathFile, '.js')
    const absolute = path.relative(path.join(__dirname, '..'), dirname)
    const arrDir = absolute ? absolute.split(path.sep) : []
    arrDir.push(filename)
    const namespace = arrDir.join('/')

    this._namespace = `${namespace}`
    return this
}

Debug.prototype.getNamespace = function () {
    return this._namespace
}

Debug.prototype.setSubNamespace = function (sub) {
    this._namespace = `${this._namespace}/${sub}`

    return this
}

Debug.prototype.log = function (...args) {
    print('log', this._namespace, ...args)
}

Debug.prototype.info = function (...args) {
    print('info', this._namespace, ...args)
}

Debug.prototype.warn = function (...args) {
    print('warn', this._namespace, ...args)
}

Debug.prototype.error = function (...args) {
    print('error', this._namespace, ...args)
}

Debug.prototype.critical = function (...args) {
    print('critical', this._namespace, ...args)
}

module.exports = pathFile => new Debug(pathFile)
