const Joi = require('joi').extend(require('@joi/date'))

const regexPassword = /[a-zA-Z0-9#?!@$%^&*-]/

const model = {
    gmail:Joi.string(),

    password: Joi.string().regex(regexPassword).min(6).max(256),
}

exports.register = {
    body: Joi.object({
        gmail: model.gmail.required(),
        password: model.password.required(),
        name: Joi.string().required(),
        birthday: Joi.date().format('YYYY-MM-DD').utc(),
        gender: Joi.string()
    }),
}


exports.login = {
    body: Joi.object({
        gmail: model.gmail.required(),
        password: model.password.required()
    }),
}

exports.changePassword = {
    body: Joi.object({
        oldPassword: model.password.required(),
        newPassword: model.password.required()
    })
}

exports.forgotPassword = {
    body: Joi.object({
        gmail: model.gmail.required(),
    }),
}

exports.verifyTokenForgotPassword = {
    body: Joi.object({
        gmail: model.gmail.required(),
        token: Joi.string().min(6).max(6).required(),
        newPassword: model.password.required(),
    }),
}
