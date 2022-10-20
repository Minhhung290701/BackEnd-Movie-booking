const { v4: uuidv4 } = require('uuid')
const { hashPassword } = require('../../libs/utils')
const { Debug, errors, utils } = require('../../libs')
const { DuplicatedError, UnknownError, AuthenticationError, NotFoundError } = errors
const debug = require('../../libs/debug')()

const FilmScheduleSchema = require('./schema-mg')


exports.creatFilmSchedule = async fields => {
    const filmSchedule = await FilmScheduleSchema.create(fields)

    return filmSchedule
}

exports.deleteFilmSchedule = async id => {
    await FilmScheduleSchema.deleteOne({_id:id})

    return 'success'
}


exports.getFilmSchedule = async (cinemaId, filmId, date) => {
    debug.log(cinemaId,filmId)
    let search = {}
    if(cinemaId) search.cinemaId = cinemaId
    if(filmId) search.filmId = filmId
    const filmSchedules = await FilmScheduleSchema.find(search).sort({time:1}).lean()
    debug.log(filmSchedules)

    return filmSchedules
}