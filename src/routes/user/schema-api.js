const Joi = require('joi').extend(require('@joi/date'))
Joi.objectId = require('joi-objectid')(Joi)


const regexPhoneNumber = /[0-9-+.\s]/
const regexPassword = /[a-zA-Z0-9#?!@$%^&*-]/

const id = Joi.objectId()

const model = {
    callingCode: Joi.string(),
    phoneNumber: Joi.string().regex(regexPhoneNumber).max(20),
    password: Joi.string().regex(regexPassword).min(8).max(256),
}

exports.template = {
    body: Joi.object({
        callingCode: model.callingCode.required(),
        phoneNumber: model.phoneNumber.required(),
        password: model.password.required(),
    }),
    query: Joi.object({
        skipPage: Joi.number(),
        limit: Joi.number(),
        q: Joi.string(),
    }),
    params: Joi.object({
        id: Joi.string().required(),
    }),
}

exports.updateProfile = {
    body: Joi.object({
        name: Joi.string(),
        avatarUrl: Joi.string(),
        gender: Joi.string(),
        birthday: Joi.string(),
        description: Joi.string()
    }),
}

exports.login = {
    body: Joi.object({
        callingCode: model.callingCode.required(),
        phoneNumber: model.phoneNumber.required(),
        password: model.password.required(),
    }),
}

exports.booking = {
    body: Joi.object({
        filmScheduleId:Joi.string(),
        seats: Joi.array(),
        amount: Joi.number(),
        vnpReturnUrl: Joi.string()
    })
}


exports.getTickets = {
    query: Joi.object({
        limit: Joi.number(),
        skipPage: Joi.number()
    })
}

exports.getTicket = {
    params: Joi.object({ id }),
}

exports.readTicket = {
    body : Joi.object({
        id
    })
}