const mongoose = require('mongoose')
const mongooseLeanGetters = require('mongoose-lean-getters')
const Schema = mongoose.Schema

const { DefaultDB } = require('../../connections/mongodb')
const mf = require('../../libs').mongoField

const ticketSchema = new Schema(
    {
        _id: mf().id().auto().j(),
        profileId: mf().id().ref('Profile'),
        filmScheduleId: mf().id().ref('FilmSchedule'),
        amount: mf().number().j(),
        seats: [],
        status: mf().string('pending').j(),
        isReaded: mf().boolean(false).j()
    },
    { timestamps: true},
)   

ticketSchema.plugin(mongooseLeanGetters)


ticketSchema.index({})

module.exports = DefaultDB.model('Ticket', ticketSchema, 'tickets')
