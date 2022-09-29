const mongoose = require('mongoose')
const mongooseLeanGetters = require('mongoose-lean-getters')
const Schema = mongoose.Schema

const { DefaultDB } = require('../../connections/mongodb')
const mf = require('../../libs').mongoField

const { GENDER, CLASS } = require('./static')

const genders = Object.values(GENDER)
const classes = Object.values(CLASS)

const profileSchema = new Schema(
    {
        _id: mf().id().auto().required().j(),
        name: mf().string().required().j(),
        accountId: mf().id().ref('Account'),
        avatarUrl: mf().mediaUrl().j(),
        gender: mf().string().enum(genders).j(),
        birthday: mf().date().j(),
        totalPay: mf().number(0).j(),
        memberClass: mf().string('standard').enum(classes).j(),
        description: mf().string().j(),
        isDeleted: mf().boolean(false).j(),
    },
    { timestamps: true},
)

profileSchema.plugin(mongooseLeanGetters)


profileSchema.index({ name: 1 })

module.exports = DefaultDB.model('Profile', profileSchema, 'profiles')
