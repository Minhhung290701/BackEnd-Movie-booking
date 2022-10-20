const mongoose = require('mongoose')
const mongooseLeanGetters = require('mongoose-lean-getters')
const Schema = mongoose.Schema

const { DefaultDB } = require('../../connections/mongodb')
const mf = require('../../libs').mongoField

const filmScheduleSchema = new Schema(
    {
        _id: mf().id().auto().j(),
        filmId: mf().id().ref('Film'),
        cinemaId: mf().id().ref('Cinema'),
        room: mf().string(),
        time: mf().date(),
        seats: [],
        numEmptySeat: mf().number(80)
    },
    { timestamps: true},
)

filmScheduleSchema.plugin(mongooseLeanGetters)


//filmScheduleSchema.index({createdAt: 1},{expireAfterSeconds: 1,partialFilterExpression : {createdAt: time_start}});

module.exports = DefaultDB.model('FilmSchedule', filmScheduleSchema, 'filmSchedules')
