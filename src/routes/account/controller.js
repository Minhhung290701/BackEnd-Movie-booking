const { Account, Profile } = require('../../resources')
const { utils, errors, Debug } = require('../../libs')
const htmlTemplate = require('./html-template')
const Redis = require('../../connections/redis')
const redis = Redis.getConnection()

const debug = Debug()
const {
    NotFoundError,
    DataError,
    PermissionError,
    AuthenticationError,
    ValidationError,
    ConflictError,
    DuplicatedError
} = errors

exports.register = async ctx => {
    const item = ctx.request.body

    const account = {
        gmail: item.gmail,
        password: item.password
    }

    const check = await Account.Model.getAccountByGmail(item.gmail)

    if(check) {
        throw new DuplicatedError('Gmail đã được sử dụng')
    }

    const accountId = await Account.Model.createAccount(account)

    const profile = {
        ...item,
        accountId:accountId
    }

    delete profile.gmail
    delete profile.password

    await Profile.Model.createProfile(profile)

    ctx.body = 'success'
}

exports.login = async ctx => {
    const { gmail, password} = ctx.request.body

    const account = await Account.Model.getAccountByGmail(gmail)

    if (!account) {
        throw new ValidationError('User not found')
    }

    if (!utils.verifyPassword(password, account.hashPassword)) {
        throw new ValidationError('Password is incorrect')
    }

    delete account.hashPassword

    const profile = await Profile.Model.getProfileByAccountId(account._id)
    if(!profile) {
        throw new ValidationError('User not found')
    }

    ctx.body = {
        ...profile,
        accessToken: utils.generateAccessToken(profile),
        refreshToken: utils.generateRefreshToken(profile),
    }
}


exports.changePassword = async ctx => {
    const {oldPassword, newPassword} = ctx.request.body
    const profile = ctx.state.profile

    await Account.Model.changePassword(profile.accountId, oldPassword, newPassword)


    ctx.body = 'success'
}

exports.forgotPassword = async ctx => {
    const { gmail } = ctx.request.body

    const account = await Account.Model.getAccountByGmail(gmail)

    if (!account || account.isDeleted) {
        throw new NotFoundError('Not fount gmail')
    }

    const token = utils.randomAsciiString(6)
    const key = Redis.genKey('token-reset-password', gmail)
    debug.log(key)
    await redis.set(key, token, 'EX', 30 * 60) // 30 minutes

    const gmailSubject = 'Reset password - App cinema'

    utils.sendMail(gmail, gmailSubject, null, htmlTemplate.verifyForgotPassword(gmail, token))

    ctx.body = 'success'
}


exports.verifyTokenForgotPassword = async ctx => {
    const { gmail, token, newPassword } = ctx.request.body

    const account = await Account.Model.getAccountByGmail(gmail)

    if (!account || account.isDeleted) {
        throw new NotFoundError('Not fount email')
    }

    const key = Redis.genKey('token-reset-password', gmail)
    await checkToken(key, token)

    await Account.Model.setNewPassword(account._id, newPassword)
    await redis.del(key)

    ctx.body = 'success'
}

async function checkToken(key, token) {
    const cachedToken = await redis.get(key)
    debug.log(cachedToken)

    if (!cachedToken) {
        throw new ValidationError('Token is invalid')
    } else if (cachedToken !== token) {
        const countingKey = Redis.genKey('wrong', key)
        const counting = await redis.get(countingKey)
        if (!counting) {
            await redis.set(countingKey, 1, 'EX', 600)
        } else if (counting < 4) {
            await redis.set(countingKey, parseInt(counting) + 1, 'EX', 600)
        } else {
            redis.del(countingKey)
            redis.del(key)
            throw new ValidationError('Your are wrong 5 times. Please take a new token.', 4121)
        }
        throw new ValidationError('Token is invalid')
    }
}