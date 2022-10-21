const { v4: uuidv4 } = require('uuid')
const { hashPassword } = require('../../libs/utils')
const { Debug, errors, utils } = require('../../libs')
const { DuplicatedError, UnknownError, AuthenticationError, NotFoundError } = errors
const debug = require('../../libs/debug')()

const BannerSchema = require('./schema-mg')


exports.creatBanner = async fields => {
    const banner = await BannerSchema.create(fields)

    return banner
}


exports.deleteBanner = async id => {
    await BannerSchema.findByIdAndDelete(id)

    return 'success'
}

exports.getBanners = async ()=> {
    const banners = await BannerSchema.find().lean()

    return banners
}