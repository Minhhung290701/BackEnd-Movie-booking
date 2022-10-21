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
    const now = new Date()
    debug.log(cinemaId,filmId)
    const today = new Date(date+'T00:00')
    let mili = today.getTime()
    let newlimi = mili + 172800000/2
    const tomorrow = new Date(newlimi);
    debug.log(tomorrow)

    let search = {}

    let begin = (today.getTime() < now.getTime())? now:today

    search.time = {
        $gte: begin,
        $lte: tomorrow
    }

    if(cinemaId) search.cinemaId = cinemaId
    if(filmId) search.filmId = filmId

    
    debug.log(search)
    const filmSchedules = await FilmScheduleSchema.find(search).sort({time:1}).lean()
    debug.log(filmSchedules)

    return filmSchedules
}