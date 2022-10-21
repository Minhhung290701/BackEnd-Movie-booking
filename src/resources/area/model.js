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

exports.deleteArea = async id => {
    await AreaSchema.deleteOne({_id:id})
}

exports.updateArea = async (id, fields) => {
    debug.log(fields)
    await AreaSchema.updateOne({_id:id}, fields)

    return await AreaSchema.findById(id).lean()
}

exports.getAreas = async (limit, skip) => {
    debug.log(limit,skip)

    const total = await AreaSchema.count({})

    const areas = await AreaSchema.find({}).skip(skip).limit(limit).lean()

    return {areas, total}
}