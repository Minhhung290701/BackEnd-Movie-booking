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


exports.getFilmSchedule = async (areaId, filmId, date) => {

    if(areaId) {
        var cinemas = await Cinema.Model.getCinemas(100,0,areaId)
        debug.log(cinemas)
    }
    //debug.log(cinemas)
    if(cinemas){
        var cinemasId=[]
        await Promise.all(
            cinemas.cinemas.map(async cinema => {
                cinemasId.push(cinema._id.toString())
            })
        )
    }
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

    for(filmSchedule of filmSchedules){
        //await filmSchedules.map(async filmSchedule => {
            //debug.log(filmSchedule)
            const cinema = await Cinema.Model.getCinema(filmSchedule.cinemaId)
            //debug.log(cinema)
            //delete filmSchedule.seats
            delete filmSchedule.createdAt
            delete filmSchedule.updatedAt
            delete filmSchedule.__v
            //delete filmSchedule.filmId
            //delete filmSchedule.cinemaId
            //delete filmSchedule.room

            let key = cinema.name
            let keyId = cinema._id.toString()
            if(cinemasId) {
                if(!data.hasOwnProperty(key) && cinemasId.includes(keyId)) {
                    data[key]=[filmSchedule]
                }
                else{
                    if(cinemasId.includes(keyId)) {
                        data[key].push(filmSchedule)
                    }
                }
            }
            else {
                if(!data.hasOwnProperty(key) ) {
                    data[key]=[filmSchedule]
                }
                else{
                    data[key].push(filmSchedule)
                }
            }
        }
    data = this.sortObject(data)

    return data
}

exports.getFilmScheduleByCinemaId = async (cinemaId, date) => {
    const now = new Date()
    const today = new Date(date)
    let mili = today.getTime()
    let newlimi = mili + 172800000/2
    const tomorrow = new Date(newlimi);

    let search = {
        cinemaId:cinemaId.toString()
    }

    let begin = (today.getTime() < now.getTime())? now:today

    search.time = {
        $gte: begin,
        $lte: tomorrow
    }

    debug.log(search)

    const filmSchedules = await FilmScheduleSchema.find(search).sort({time:1}).lean()
    debug.log(filmSchedules)
    
    let data = {}
    let keys = []

    for(filmSchedule of filmSchedules){
            //const film = await Film.Model.getFilmById(filmSchedule.filmId)
            //debug.log(film)
            delete filmSchedule.createdAt
            delete filmSchedule.updatedAt
            delete filmSchedule.__v

            let keyId = filmSchedule.filmId

            if(!data.hasOwnProperty(keyId)) {
                data[keyId]=[filmSchedule]
            }
            else{
                data[keyId].push(filmSchedule)
            }
    }

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

exports.checkExist = async (filmId, cinemaId, room, time, min) => {
    const checkDupilcateTime = await FilmScheduleSchema.find({
        cinemaId:cinemaId,
        filmId:filmId,
        time: time
    }).lean()

    if(checkDupilcateTime.length>0) {
        return false
    }

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

    //debug.log('Check2')
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


exports.getFilmScheduleById = async id => {
    const filmSchedule = await FilmScheduleSchema.findById(id).lean()

    return filmSchedule
}

exports.bookingSuccess = async (id, seats) => {
    let filmSchedule = await FilmScheduleSchema.findById(id).lean()
    const newSeats = filmSchedule.seats

    for (let x of seats) {
        newSeats[x-1].isBooked = true
    }

    const newNumEmptySeat = filmSchedule.numEmptySeat - seats.length

    await FilmScheduleSchema.findByIdAndUpdate(id, {seats: newSeats, numEmptySeat: newNumEmptySeat})
    const film = await Film.Model.getFilmById(filmSchedule.filmId)
    const cinema = await Cinema.Model.getCinema(filmSchedule.cinemaId)

    filmSchedule.film = film
    filmSchedule.cinema = cinema

    return filmSchedule
}
