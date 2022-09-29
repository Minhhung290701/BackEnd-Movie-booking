const Joi = require('joi').extend(require('@joi/date'))

const regexPassword = /[a-zA-Z0-9#?!@$%^&*-]/

const model = {
    gmail:Joi.string(),
    password: Joi.string().regex(regexPassword).min(6).max(256),
}



exports.login = {
    body: Joi.object({
        gmail: model.gmail.required(),
        password: model.password.required()
    }),
}