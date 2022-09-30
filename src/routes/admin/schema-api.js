const Joi = require('joi').extend(require('@joi/date'))
Joi.objectId = require('joi-objectid')(Joi)



exports.addArea = {
    body: Joi.object({
        name: Joi.string()
    }),
}

exports.deleteArea = {
    params: Joi.object({
        id:Joi.string()
    })
}

exports.addCinema = {
    body: Joi.object({
        name: Joi.string(),
        avatarUrl: Joi.string(),
        areaId: Joi.objectId(),
        address: Joi.string(),
        lat: Joi.string(),
        lon: Joi.string(),
        description: Joi.string(),
        room: Joi.array().items(Joi.number())
    })
}
