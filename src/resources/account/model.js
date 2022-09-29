const { v4: uuidv4 } = require('uuid')
const { hashPassword } = require('../../libs/utils')
const { Debug, errors, utils } = require('../../libs')
const { DuplicatedError, UnknownError, AuthenticationError, NotFoundError } = errors
const debug = require('../../libs/debug')()

const AccountSchema = require('./schema-mg')

exports.getAccountById =async accountId => {
    const account = await AccountSchema.findById(accountId).lean()
    if(!account) {
        throw new NotFoundError('Not found account')
    }

    return account
}

exports.createAccount = async entity => {
    entity.hashPassword = hashPassword(entity.password)
    delete entity.password
    const account =  await AccountSchema.create(entity)
    return account._id
}

exports.getAccountByGmail = async (gmail) => {
    const account = await AccountSchema.findOne({gmail:gmail}).lean()
    debug.log(account)
    return account
}

exports.changePassword = async (accountId, oldPassword, newPassword) => {
    const account = await this.getAccountById(accountId)
    debug.log(account)

    if (!utils.verifyPassword(oldPassword, account.hashPassword)) {
        throw new AuthenticationError('Old password is incorrect')
    }
    const newHashPassword = hashPassword(newPassword)
    debug.log(newHashPassword)

    await AccountSchema.updateOne({_id:accountId},{hashPassword:newHashPassword})

}

exports.setNewPassword = async (accountId, newPassword) => {
    const newHashPassword = hashPassword(newPassword)

    await AccountSchema.updateOne({_id:accountId},{hashPassword:newHashPassword})
    debug.log('done')

}