const mongoose = require('mongoose')
const mongooseLeanGetters = require('mongoose-lean-getters')
const Schema = mongoose.Schema

const { DefaultDB } = require('../../connections/mongodb')
const mf = require('../../libs').mongoField

const filmSchema = new Schema(
    {
        _id: mf().id().auto().j(),
        name: mf().string().j(),
        avatarUrl: mf().mediaUrl().j(),
        ageRestriction: mf().number().j(),
        durationMin: mf().number().j(),
        trailerUrl: mf().mediaUrl().j(),
        director: mf().string().j(),
        actors: mf().string().j(),
        description: mf().string(),
        openingDay: mf().date().j(),
        totalLike: mf().number(0).j(),
    },
    { timestamps: true},
)

filmSchema.plugin(mongooseLeanGetters)


filmSchema.index({ isDeleted: 1 })

module.exports = DefaultDB.model('Film', filmSchema, 'films')
