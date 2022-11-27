const { v4: uuidv4 } = require('uuid')
const { hashPassword } = require('../../libs/utils')
const { Debug, errors, utils } = require('../../libs')
const { DuplicatedError, UnknownError, AuthenticationError, NotFoundError } = errors
const debug = require('../../libs/debug')()

const NewSchema = require('./schema-mg')


exports.creatNew = async fields => {
    const newi = await NewSchema.create(fields)

    return newi
}


exports.deleteNew = async id => {
    await NewSchema.findByIdAndDelete(id)

    return 'success'
}

exports.getNews = async limit => {
    const side = await NewSchema.find({type: 'side'}).sort({createdAt: -1}).limit(limit).lean()

    const promotion = await NewSchema.find({type: 'promotion'}).sort({createdAt: -1}).limit(limit).lean()

    return {
        side: side,
        promotion: promotion
    }

}