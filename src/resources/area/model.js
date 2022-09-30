const { v4: uuidv4 } = require('uuid')
const { hashPassword } = require('../../libs/utils')
const { Debug, errors, utils } = require('../../libs')
const { DuplicatedError, UnknownError, AuthenticationError, NotFoundError } = errors
const debug = require('../../libs/debug')()

const AreaSchema = require('./schema-mg')

exports.getAreaByName = async name => {
    return  await AreaSchema.findOne({name: name})
}

exports.getAreaById = async id => {
    return  await AreaSchema.findOne({_id: id})
}

exports.creatArea = async name => {
    const area = await AreaSchema.create({name:name})

    return area
}

exports.deleteArea = async _id => {
    await AreaSchema.deleteOne({_id:_id})
}