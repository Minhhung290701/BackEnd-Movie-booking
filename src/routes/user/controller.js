const { Account, Profile } = require('../../resources')
const { utils, errors, Debug } = require('../../libs')
const debug = Debug()
const {
    NotFoundError,
    DataError,
    PermissionError,
    AuthenticationError,
    ValidationError,
    ConflictError,
} = errors

exports.updateProfile = async ctx => {
    const profile = ctx.state.profile
    const fields = ctx.request.body

    const newProfile = await Profile.Model.updateProfile(profile._id,fields)

    ctx.body = newProfile
}

exports.login = async ctx => {
    const { callingCode, phoneNumber, password } = ctx.request.body

    const account = await Account.Model.getUserByPhoneNumber(phoneNumber, callingCode)

    if (!account) {
        throw new ValidationError('User not found')
    }

    if (!utils.verifyPassword(password, account.hashPassword)) {
        throw new ValidationError('Password is incorrect')
    }

    delete account.hashPassword

    ctx.body = {
        ...account,
        accessToken: utils.generateAccessToken(account),
        refreshToken: utils.generateRefreshToken(account),
    }
}