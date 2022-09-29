const _ = require('lodash')
const { errors, utils } = require('../libs')
const { ValidationError } = errors

exports.validateApiSchema = (schemas, handleLogging) => {
    if (!schemas) {
        throw new Error('Schema of api is not defined')
    }

    return (ctx, next) => {
        const { body } = ctx.request
        const { params, query } = ctx

        const data = {
            body,
            params,
            query,
        }

        const positions = Object.keys(schemas) // [body, params, query]
        if (schemas.headers) {
            data.headers = _.pick(ctx.request.headers, Object.keys(schemas.headers))
        }

        for (let i = 0; i < positions.length; i += 1) {
            const part = positions[i]
            const schema = typeof schemas[part] === 'function' ? schemas[part](ctx) : schemas[part]
            const partSchema = data[part]
            if (part === 'params') {
                delete partSchema['0']
            }
            const { error } = schema.validate(partSchema)
            const details = !error || error.details

            if (error) {
                if (handleLogging) {
                    handleLogging(error, ctx)
                }

                throw new ValidationError(`Missing or invalid params at ${part}`, null, details)
            }
        }

        return next()
    }
}

/**
 * Prevent logging request & response in some case must to protect data
 * @param {Object} ctx koa ctx
 * @param {Function} next koa next function
 * @returns next controller result
 */
exports.preventLog = (ctx, next) => {
    ctx.state.preventLog = true
    return next()
}

exports.useOriginalResponse = (ctx, next) => {
    ctx.state.originalResponse = true
    return next()
}

exports.validateAccessToken = async function (ctx, next) {
    const authorization = ctx.request.headers['authorization']

    const payload = utils.decodeToken(authorization)

    ctx.state.profile = payload

    return next()
}

/**
 * Kiểm tra tính hợp lệ access token của admin
 * @param {Object} ctx koa ctx
 * @param {Function} next koa next function
 */
 exports.validateAdminAccessToken = async function (ctx, next) {
    const authorization = ctx.request.headers['authorization']

    const payload = utils.decodeTokenAdmin(authorization, ctx)

    ctx.state.admin = payload

    return next()
}

exports.unimplemented = ctx => (ctx.body = 'This api is not implemented')

function orPermissions(myPermissions, requiredPermissions) {
    if (!Array.isArray(requiredPermissions)) {
        throw new Error('"or" permissions must be an array')
    }

    const isOk = false

    for (const permission of requiredPermissions) {
        if (typeof permission === 'string') {
            if (requiredPermissions.includes(permission)) {
                return true
            }
        } else if (typeof permission === 'object') {
            if (permission.or && orPermissions(myPermissions, permission.or)) {
                return true
            }
            if (permission.and && andPermissions(myPermissions, permission.and)) {
                return true
            }
        } else {
            throw new Error('"or" permissions only contains string or object')
        }
    }

    return isOk
}

function andPermissions(myPermissions, requiredPermissions) {
    if (!Array.isArray(requiredPermissions)) {
        throw new Error('"and" permissions must be an array')
    }

    const isOk = true

    for (const permission of requiredPermissions) {
        if (typeof permission === 'string') {
            if (!requiredPermissions.includes(permission)) {
                return false
            }
        } else if (typeof permission === 'object') {
            if (permission.or && !orPermissions(myPermissions, permission.or)) {
                return false
            }
            if (permission.and && !andPermissions(myPermissions, permission.and)) {
                return false
            }
        } else {
            throw new Error('"and" permissions only contains string or object')
        }
    }

    return isOk
}
