const { v4: uuidv4 } = require('uuid')
const ProfileSchema = require('./schema-mg')


exports.createProfile = async item => {
    await ProfileSchema.create(item)
}

exports.getProfileByAccountId = async accountId => {
    const profile = await ProfileSchema.findOne({accountId:accountId}).lean()

    return profile
}

exports.updateProfile = async (_id,fields) => {
    await ProfileSchema.updateOne({_id}, fields)

    const profile = await ProfileSchema.findById(_id)

    return profile
}

