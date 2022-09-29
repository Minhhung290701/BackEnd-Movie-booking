const mongoose = require('mongoose')
const mongooseLeanGetters = require('mongoose-lean-getters')
const Schema = mongoose.Schema

const { DefaultDB } = require('../../../connections/mongodb')
const mf = require('../../../libs').mongoField

const adminAccountSchema = new Schema(
    {
        _id: mf().id().auto().j(),
        gmail: mf().string().j(),
        name:mf().string().j(),
        hashPassword: mf().string().j(),
        isDeleted: mf().boolean(false).j(),
    },
    { timestamps: true},
)

adminAccountSchema.plugin(mongooseLeanGetters)


adminAccountSchema.index({ isDeleted: 1 })

module.exports = DefaultDB.model('AdminAccount', adminAccountSchema, 'adminAccounts')
