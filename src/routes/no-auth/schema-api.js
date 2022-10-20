const Joi = require('joi').extend(require('@joi/date'))
Joi.objectId = require('joi-objectid')(Joi)

const id = Joi.objectId()


exports.addArea = {
    body: Joi.object({
        name: Joi.string()
    }),
}

exports.delete = {
    params: Joi.object({
        id:Joi.string()
    })
}

exports.getAreas = {
    query: Joi.object({
        limit: Joi.number(),
        skipPage: Joi.number()
    })
}

exports.getCinemas = {
    query: Joi.object({
        limit: Joi.number(),
        skipPage: Joi.number(),
        areaId: Joi.objectId()
    })
}

exports.getListFilm = {
    query: Joi.object({
        limit: Joi.number(),
        skipPage: Joi.number(),
    })
}

exports.getCinema = {
    params: Joi.object({ id }),
}

exports.getFilmSchedule = {
    query: Joi.object({
        cinemaId: id,
        filmId:id,
        date: Joi.string()
    })
}