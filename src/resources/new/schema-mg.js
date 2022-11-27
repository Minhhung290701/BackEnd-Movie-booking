const mongoose = require('mongoose')
const mongooseLeanGetters = require('mongoose-lean-getters')
const Schema = mongoose.Schema

const { DefaultDB } = require('../../connections/mongodb')
const mf = require('../../libs').mongoField


const newSchema = new Schema(
    {
        _id: mf().id().auto().required().j(),
        type: mf().string().enum(['promotion','side']),
        imgUrl: mf().mediaUrl().j(),
        title: mf().string().j(),
        description: mf().string().j()
    },
    { timestamps: true},
)

newSchema.plugin(mongooseLeanGetters)

newSchema.index({ type: 1 })

module.exports = DefaultDB.model('New', newSchema, 'news')
