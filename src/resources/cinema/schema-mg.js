const mongoose = require('mongoose')
const mongooseLeanGetters = require('mongoose-lean-getters')
const Schema = mongoose.Schema

const { DefaultDB } = require('../../connections/mongodb')
const mf = require('../../libs').mongoField

const cinemaSchema = new Schema(
    {
        _id: mf().id().auto().j(),
        name: mf().string().j(),
        avatarUrl: mf().mediaUrl().j(),
        areaId: mf().id().ref('Area'),
        address: mf().string(),
        lat: mf().string(),
        lon: mf().string(),
        description: mf().string(),
        room: [mf().number().j()],
    },
    { timestamps: true},
)   

cinemaSchema.plugin(mongooseLeanGetters)


cinemaSchema.index({ isDeleted: 1 })

module.exports = DefaultDB.model('Cinema', cinemaSchema, 'cinemas')
