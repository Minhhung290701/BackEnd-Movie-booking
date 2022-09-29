const { v4: uuidv4 } = require('uuid')
// const { AuthenticationError, ValidationError } = require('../util/error')
const debug = require('../libs/debug')()
const { NODE_ENV } = process.env

const responseHandler = (ctx, next) => {
    const request_id = uuidv4()
    ctx.request.headers['app-request-id'] = request_id
    ctx.response.set({ 'app-request-id': request_id })

    return next()
        .then(() => {
            if (ctx.res.statusCode === 404 && ctx.request.method !== 'OPTIONS') {
                ctx.status = 404
                ctx.body = {
                    error: {
                        code: 404,
                        message: 'Not found api, please check path',
                        type: 'NotFoundError',
                    },
                }
                return
            }
            if (ctx.status === 204) {
                ctx.status = 200
            }

            // ctx.state.originalBody is customer field
            // if true then forward original ctx.body
            const body = ctx.state.originalResponse
                ? ctx.body
                : {
                      data: ctx.body,
                      paging: ctx.state.paging,
                  }
            ctx.body = body
            if (
                NODE_ENV !== 'production' &&
                ctx.request.headers['app-debugger'] &&
                !ctx.state.preventLog
            ) {
                print('info', null, ctx)
            }
        })
        .catch(error => {
            console.error(error)
            // if (error instanceof AuthenticationError) ctx.status = 401
            // else if (error instanceof ValidationError) ctx.status = 412
            // else ctx.status = 500
            const status = parseInt(error.code)
            ctx.status = 99 < status && status < 600 ? status : 500
            ctx.body = {
                error: {
                    code: error.code || 500,
                    message: error.message,
                    type: error.type || 'UnknownError',
                    details: error.details,
                },
            }
            if (!ctx.state.preventLog) {
                print('info', error, ctx)
            }
        })
}

module.exports = responseHandler

const print = (level = 'info', error, ctx) => {
    const request = {
        headers: { ...ctx.request.headers },
        params: ctx.params,
        query: ctx.request.query,
        body: ctx.request.body,
        request_id: ctx.request.headers['abv-request-id'],
    }

    protect(request.headers)
    protect(request.query)

    const response = {
        headers: ctx.response.headers,
        body: { ...ctx.body },
    }

    if (typeof response.body.data === 'object') {
        response.body.data = { ...response.body.data }
        protect(response.body.data)
    } else if (typeof response.body.data === 'string') {
        response.body.data = response.body.data.slice(0, 10) + '...'
    }

    debug[level]('%o', {
        REQUEST: request,
        RESPONSE: response,
        request_id: request.request_id,
        method: ctx.request.method,
        path: ctx.request.path,
        error: error
            ? {
                  message: error.message,
                  stack: error.stack,
              }
            : error,
    })
}

function protect(data) {
    const protectedFields = [
        'x-access-token',
        'authorization',
        'token',
        'accessToken',
        'refreshToken',
        'password',
    ]
    protectedFields.forEach(field => {
        if (data[field]) {
            data[field] = data[field].slice(0, 2) + '...'
        }
    })
}
