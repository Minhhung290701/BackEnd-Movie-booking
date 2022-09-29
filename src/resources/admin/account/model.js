const { Debug, errors, utils } = require('../../../libs')
const { DuplicatedError, UnknownError, AuthenticationError, NotFoundError } = errors
const { hashPassword } = require('../../../libs/utils')
const debug = require('../../../libs/debug')()

const AdminAccountSchema = require('./schema-mg')


exports.createAccount = async entity => {
    entity.hashPassword = hashPassword(entity.password)
    delete entity.password
    const account =  await AdminAccountSchema.create(entity)
    return account._id
}

exports.getAccountByGmail = async (gmail) => {
    const account = await AdminAccountSchema.findOne({gmail:gmail}).lean()
    debug.log(account)
    return account
}