const { v4: uuidv4 } = require('uuid')
const { hashPassword } = require('../../libs/utils')
const { Debug, errors, utils } = require('../../libs')
const { DuplicatedError, UnknownError, AuthenticationError, NotFoundError } = errors
const debug = require('../../libs/debug')()

const FilmScheduleSchema = require('./schema-mg')
const { required } = require('joi')
const Film = require('../film')


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
    const today = new Date(date)
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


exports.checkExist = async (cinemaId, room,time, min) => {
    const check = await FilmScheduleSchema.find({
        cinemaId:cinemaId,
        room:room,
        time: {
            $gte: time,
            $lte: new Date(time.getTime()+min*60000)
        }
    }).lean()

    if(check.length>0) {
        return false
    }

    let check2 = true
    const filmSchedules = await FilmScheduleSchema.find({
        cinemaId:cinemaId,
        room:room,
        time: {
            $gte: new Date(time.getTime()-200*60000)
        }
    }).lean()
    debug.log(filmSchedules)


    await Promise.all(
        await filmSchedules.map(async (filmSchedule)=>{
            const film = await Film.Model.getFilmById(filmSchedule.filmId)
            debug.log(time, new Date(filmSchedule.time.getTime()+film.durationMin*60000))
            debug.log(time.getTime(),filmSchedule.time.getTime()+(film.durationMin+10)*60000, film.durationMin)

            if(time.getTime() < filmSchedule.time.getTime()+(film.durationMin+10)*60000) {
                check2 = false
            }
        })
    )

    debug.log(check2)


    return check2
}