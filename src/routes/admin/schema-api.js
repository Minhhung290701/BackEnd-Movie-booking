const Joi = require('joi').extend(require('@joi/date'))
Joi.objectId = require('joi-objectid')(Joi)



exports.addArea = {
    body: Joi.object({
        name: Joi.string()
    }),
}

exports.addBanner = {
    body: Joi.object({
        imgUrl: Joi.string()
    }),
}

exports.delete = {
    params: Joi.object({
        id:Joi.string()
    })
}

exports.update = {
    params: Joi.object({
        id:Joi.string()
    }),
    body: Joi.object({
        name: Joi.string()
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


exports.addFilm = {
    body: Joi.object({
        name: Joi.string(),
        avatarUrl: Joi.string(),
        ageRestriction: Joi.number(),
        durationMin: Joi.number(),
        trailerUrl: Joi.string(),
        director: Joi.string(),
        actors: Joi.string(),
        description: Joi.string(),
        genre: Joi.string(),
        openingDay: Joi.date()
    })
}

exports.addFilmSchedule = {
    body: Joi.object({
        filmId: Joi.objectId(),
        cinemaId: Joi.objectId(),
        room: Joi.string(),
        time: Joi.date()
    })
}

exports.getUsers = {
    query: Joi.object({
        limit: Joi.number(),
        skipPage: Joi.number()
    })
}