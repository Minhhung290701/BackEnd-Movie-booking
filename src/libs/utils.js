const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const JWT = require('jsonwebtoken')
const { AuthenticationError } = require('./errors')
const debug = require('./debug')()
const crypto = require('crypto')
const moment = require('moment')

exports.ObjectID = /^[0-9a-fA-F]{24}$/i

exports.hashPassword = function hashPassword(password) {
    return bcrypt.hashSync(password)
}

exports.verifyPassword = function compareHash(password, hashPassword) {
    return bcrypt.compareSync(password, hashPassword)
}

exports.checkAvailableByFlag = resource => resource && !resource.isDeleted
exports.checkAvailableByStatus = resource => resource && resource.status !== 'deleted'

exports.generatePaging = (skipPage = 0, limit = 1, total = 0) => {
    const skip = parseInt(skipPage || '0') * limit
    const totalPage = Math.ceil(total / limit)
    let currentPage = total

    if (total > 1) {
        currentPage = skip < total ? skipPage + 1 : -1
    }

    return {
        currentPage,
        totalPage,
        limit,
        totalItems: total,
    }
}


exports.generatePagingPreNextFrom = (entities, limit, prevFrom, nextFrom) => {
    const paging = {}
    if (prevFrom) {
        if (entities?.length > limit) {
            entities.shift() // bỏ đi phần tử lấy thêm
            paging.prevFrom = entities[0]._id
        }
        if (entities?.length) {
            paging.nextFrom = entities[entities.length - 1]._id
        }
    } else if (nextFrom) {
        if (entities?.length) {
            paging.prevFrom = entities[0]._id
        }
        if (entities?.length > limit) {
            entities.pop() // bỏ đi phần tử lấy thêm
            paging.nextFrom = entities[entities.length - 1]._id
        }
    } else {
        if (entities?.length > limit) {
            entities.shift() // bỏ đi phần tử lấy thêm
            paging.prevFrom = entities[0]._id
        }
    }
    return paging
}


exports.generatePagingPreNextFromRoom = (entities, limit, prevFrom, nextFrom) => {
    const paging = {}
    if (prevFrom) {
        if (entities?.length > limit) {
            entities.pop() // bỏ đi phần tử lấy thêm
            paging.prevFrom = entities[entities.length - 1].roomId
        }
        if (entities?.length) {
            paging.nextFrom = entities[0]._id
        }
    } else if (nextFrom) {
        if (entities?.length) {
            paging.prevFrom = entities[entities.length - 1].roomId
        }
        if (entities?.length > limit) {
            entities.shift() // bỏ đi phần tử lấy thêm
            paging.nextFrom = entities[0]._id
        }
    } else {
        if (entities?.length > limit) {
            entities.pop() // bỏ đi phần tử lấy thêm
            paging.prevFrom = entities[entities.length - 1].roomId
        }
    }
    return paging
}


exports.sendMail = async (to, subject, text, html) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: !!process.env.SMTP_SECURE,
        requireTLS: process.env.SMTP_TLS,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
    })

    var mailOptions = {
        from: process.env.SMTP_FROM,
        to: to,
        subject,
        text,
        html,
    }

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error(error)
                reject(error)
            } else {
                console.info('Successful sent an email to: ', to)
                resolve(info)
            }
        })
    })
}

/**
 * Remove empty in object
 */
exports.removeEmpty = obj => {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null))
}

/**
 * Remove empty in object
 */
exports.removeEmptyAndIdInObj = obj => {
    const newObj = Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null))
    if ('id' in obj) {
        delete newObj.id
    }
    return newObj
}

exports.cleanNullOrEmptyParameter = obj => {
    for (var propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
            delete obj[propName]
        }
    }
    return obj
}
exports.isNullOrEmpty = str => {
    if (str === null || str === '' || typeof str === undefined || str === undefined) {
        return true
    }
    return false
}

exports.getPermissionCodes = permissions => {
    if (!permissions) {
        throw new Error('Permissions must be not null')
    }

    if (!Array.isArray(permissions)) {
        throw new Error('Permissions must be an array')
    }

    const result = {}

    permissions.forEach(e => {
        result[e.code] = e.code
    })

    return result
}

exports.getFilterFromQuery = query => {
    const filter = {}
    const fields = Object.keys(query)

    fields.forEach(field => {
        const parts = field.split('.')
        if (parts[0] === 'filter' && parts[1]) {
            filter[parts[1]] = query[field]
        }
    })

    return filter
}

exports.getSortFromQuery = query => {
    const sort = {}
    const fields = Object.keys(query)

    fields.forEach(field => {
        const value = parseInt(query[field])
        const parts = field.split('.')
        if (parts[0] === 'sort' && parts[1]) {
            if (parts[1] === 'id') sort._id = value
            else sort[parts[1]] = value
        }
    })

    return sort
}
exports.decodeToken = accessToken => {
    if (!accessToken) {
        const message = 'Authorization is required'
        debug.warn(message)
        throw new AuthenticationError(message)
    }

    const [type, token] = accessToken.split(' ')

    if (type !== 'Bearer' || !token) {
        const message = 'Authorization must to be in format "Authorization: Bearer [token]"'
        debug.warn(message)
        throw new AuthenticationError(message)
    }

    let payload = false

    try {
        payload = JWT.verify(token, process.env.JWT_SECRET_KEY)
    } catch (e) {
        debug.warn(e.message)
    }

    if (!payload) {
        debug.warn('invalid token')
        throw new AuthenticationError('invalid token')
    }

    return payload
}

// exports.mediaUrl = new RegExp(`^(?!${process.env.S3_PROTOCOL}://${process.env.S3_ENDPOINT}).*$`)
exports.mediaUrl = /.*/

exports.getMonthDateRange = (year, month) => {
    var startDate = moment([year, month])

    // Clone the value before .endOf()
    var endDate = moment(startDate).endOf('month')

    // make sure to call toDate() for plain JavaScript date type
    return { start: startDate, end: endDate }
}

exports.generateAccessToken = user => {
    return this.generateToken(user, process.env.ACCESS_TOKEN_TTL)
}

exports.generateRefreshToken = user => {
    return this.generateToken(user, process.env.REFRESH_TOKEN_TTL)
}

exports.generateToken = (user, ttl) => {
    return JWT.sign(
        user,
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: ttl,
        },
    )
}

exports.randomString = (length, chars) => {
    if (!chars) {
        throw new Error("Argument 'chars' is undefined")
    }
    var charsLength = chars.length
    if (charsLength > 256) {
        throw new Error(
            "Argument 'chars' should not have more than 256 characters" +
                ', otherwise unpredictability will be broken',
        )
    }

    var randomBytes = crypto.randomBytes(length)
    var result = new Array(length)

    var cursor = 0
    for (var i = 0; i < length; i++) {
        cursor += randomBytes[i]
        result[i] = chars[cursor % charsLength]
    }

    return result.join('')
}

exports.randomAsciiString = length => {
    return this.randomString(
        length,
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    )
}