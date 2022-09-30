const mongoose = require('mongoose')
const mongooseLeanGetters = require('mongoose-lean-getters')
const Schema = mongoose.Schema

const { DefaultDB } = require('../../connections/mongodb')
const mf = require('../../libs').mongoField


const areaSchema = new Schema(
    {
        _id: mf().id().auto().required().j(),
        name: mf().string().required().j(),
    },
    { timestamps: true},
)

areaSchema.plugin(mongooseLeanGetters)


areaSchema.index({ name: 1 })

module.exports = DefaultDB.model('Area', areaSchema, 'areas')
