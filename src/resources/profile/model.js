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

exports.getProfileById = async _id => {
    const profile = await ProfileSchema.findById(_id).lean()

    return profile
}

exports.getProfiles = async (limit, skip)=> {
    const total = await ProfileSchema.count({isDeleted: false})

    const users = await ProfileSchema.find({isDeleted:false}).sort({createdAt:-1}).skip(skip).limit(limit)

    return {users, total}
}


exports.getLockedProfiles = async (limit, skip)=> {
    const total = await ProfileSchema.count({isDeleted: true})

    const users = await ProfileSchema.find({isDeleted: true}).sort({createdAt:-1}).skip(skip).limit(limit)

    return {users, total}
}

exports.deleteUndeleteUser = async id => {
    const profile = await ProfileSchema.findById(id).lean()
    if(profile.isDeleted == true) {
        await ProfileSchema.updateOne({_id:id},{isDeleted:false})
    } 
    else {
        await ProfileSchema.updateOne({_id:id},{isDeleted:true})
    }
    return 'success'
}