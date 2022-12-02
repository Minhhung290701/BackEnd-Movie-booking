const { Account } = require('../../resources/admin')
const { utils, errors, Debug } = require('../../libs')

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
        password: item.password,
        name: item.name
    }

    const check = await Account.Model.getAccountByGmail(item.gmail)

    if(check) {
        throw new DuplicatedError('Gmail đã được sử dụng')
    }

    await Account.Model.createAccount(account)

    ctx.body = 'success'
}

exports.login = async ctx => {
    const { gmail, password} = ctx.request.body

    const adminAccount = await Account.Model.getAccountByGmail(gmail)

    if (!adminAccount) {
        throw new ValidationError('User not found')
    }

    if (!utils.verifyPassword(password, adminAccount.hashPassword)) {
        throw new ValidationError('Password is incorrect')
    }

    delete adminAccount.hashPassword


    ctx.body = {
        ...adminAccount,
        isAdmin: true,
        accessToken: utils.generateAccessToken(adminAccount),
        refreshToken: utils.generateRefreshToken(adminAccount),
    }
}
