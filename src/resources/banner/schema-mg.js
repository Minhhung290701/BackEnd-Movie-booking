const mongoose = require('mongoose')
const mongooseLeanGetters = require('mongoose-lean-getters')
const Schema = mongoose.Schema

const { DefaultDB } = require('../../connections/mongodb')
const mf = require('../../libs').mongoField


const bannerSchema = new Schema(
    {
        _id: mf().id().auto().required().j(),
        imgUrl: mf().mediaUrl().j(),
    },
    { timestamps: true},
)

bannerSchema.plugin(mongooseLeanGetters)


bannerSchema.index({ name: 1 })

module.exports = DefaultDB.model('Banner', bannerSchema, 'banners')
