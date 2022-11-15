const { v4: uuidv4 } = require('uuid')
const { hashPassword } = require('../../libs/utils')
const { Debug, errors, utils } = require('../../libs')
const { DuplicatedError, UnknownError, AuthenticationError, NotFoundError } = errors
const debug = require('../../libs/debug')()

const FilmScheduleSchema = require('./schema-mg')
const { required } = require('joi')
const Film = require('../film')
const { Cinema } = require('..')


exports.creatFilmSchedule = async fields => {
    const filmSchedule = await FilmScheduleSchema.create(fields)

    return filmSchedule
}

exports.deleteFilmSchedule = async id => {
    await FilmScheduleSchema.deleteOne({_id:id})

    return 'success'
}


exports.getFilmSchedule = async (filmId, date) => {
    const now = new Date()
    const today = new Date(date)
    let mili = today.getTime()
    let newlimi = mili + 172800000/2
    const tomorrow = new Date(newlimi);

    let search = {}

    let begin = (today.getTime() < now.getTime())? now:today

    search.time = {
        $gte: begin,
        $lte: tomorrow
    }
    if(filmId) search.filmId = filmId

    const filmSchedules = await FilmScheduleSchema.find(search).sort({time:1}).lean()
    let data = {}

    await Promise.all(
        await filmSchedules.map(async filmSchedule => {
            const cinema = await Cinema.Model.getCinema(filmSchedule.cinemaId)
            delete filmSchedule.seats
            delete filmSchedule.createdAt
            delete filmSchedule.updatedAt
            delete filmSchedule.__v
            delete filmSchedule.filmId
            delete filmSchedule.cinemaId
            delete filmSchedule.room
            let key = cinema.name
            
            if(!data.hasOwnProperty(key)) {
                data[key]=[filmSchedule]
            }
            else{
                data[key].push(filmSchedule)
            }
        })
    )
    data = this.sortObject(data)

    return data
}

exports.sortObject = (o) => {
    var sorted = {},
        key, a = [];

    for (key in o) {
        if (o.hasOwnProperty(key)) {
            a.push(key);
        }
    }

    a.sort();

    for (key = 0; key < a.length; key++) {
        sorted[a[key]] = o[a[key]];
    }
    return sorted;
}

exports.checkExist = async (cinemaId,time, min) => {
    const check = await FilmScheduleSchema.find({
        cinemaId:cinemaId,
        //room:room,
        time: {
            $gte: time,
            $lte: new Date(time.getTime()+min*60000)
        }
    }).lean()

    if(check.length>0) {
        return false
    }

    //debug.log('Check2')
    let check2 = true
    const filmSchedules = await FilmScheduleSchema.find({
        cinemaId:cinemaId,
        //room:room,
        time: {
            $lte: new Date(time.getTime()-200*60000)
        }
    }).lean()
    //debug.log(filmSchedules)


    await Promise.all(
        await filmSchedules.map(async (filmSchedule)=>{
            const film = await Film.Model.getFilmById(filmSchedule.filmId)
            //debug.log(time, new Date(filmSchedule.time.getTime()+film.durationMin*60000))
            //debug.log(time.getTime(),filmSchedule.time.getTime()+(film.durationMin+10)*60000, film.durationMin)

            if(time.getTime() < filmSchedule.time.getTime()+(film.durationMin+10)*60000) {
                check2 = false
            }
        })
    )


    return check2
}


exports.checkExistInDate = async (filmId, time) => {
    const check = await FilmScheduleSchema.find({
        filmId:filmId.toString(),
        time: {
            $gte: time,
            $lte: new Date(time.getTime()+86400000)
        }
    }).lean()

    //debug.log(filmId,time,check)

    if(check.length>0) {
        return true
    }
    return false
}