const { v4: uuidv4 } = require('uuid')
const { hashPassword } = require('../../libs/utils')
const { Debug, errors, utils } = require('../../libs')
const { DuplicatedError, UnknownError, AuthenticationError, NotFoundError } = errors
const debug = require('../../libs/debug')()

const FilmSchema = require('./schema-mg')
const FilmScheduleSchema = require('../film-schedule/schema-mg')

exports.creatFilm = async fields => {
    const film = await FilmSchema.create(fields)

    return film
}

exports.deleteFilm = async id => {
    await FilmSchema.deleteOne({_id:id})

    return 'success'
}

exports.getFilms = async (limit, skip, type) => {
    let total
    let films
    if(!type) {
        total = await FilmSchema.count({})
        films = await FilmSchema.find().sort({createdAt:-1}).skip(skip).limit(limit).lean()
    }
    if(type == 1) {
        const now = new Date()
        total = await FilmSchema.count({
            openingDay: {
                $gte: new Date(now.getTime()+172800000*3)
            }
        })

        films = await FilmSchema.find({
            openingDay: {
                $gte: now,
                $lte: new Date(now.getTime()+172800000*3)
            }
        }).sort({createdAt:-1}).skip(skip).limit(limit).lean()

    }

    if(type == 2) {
        const now = new Date()
        total = await FilmSchema.count({
            openingDay: {
                $lte: new Date(now.getTime())
            }
        })


        films = await FilmSchema.find({
            openingDay: {
                $lte: new Date(now.getTime())
            }
        }).sort({createdAt:-1}).skip(skip).limit(limit).lean()
    }


    if(type == 3) {
        const now = new Date()
        const dataFilms = await FilmSchema.find({
            openingDay: {
                $gte: new Date(now.getTime())
            }
        }).sort({createdAt:-1})

        let count = 0
        let firsFilms = []

        await Promise.all(
            await dataFilms.map(async (dataFilm)=>{
                const check = await FilmScheduleSchema.findOne({filmId:dataFilm._id.toString(),time:{$lte:dataFilm.openingDay}})
                debug.log(dataFilm._id)
                if(check) {
                    firsFilms.push(dataFilm)
                    count ++
                }
            })
        )

        films = firsFilms.slice(skip, skip+limit)

        total = count
    }
    

    return {films, total}
}

exports.getFilmById = async id => {
    const film = await FilmSchema.findById(id).lean()

    return film
}

exports.updateFilm = async (id, fields) => {
    await FilmSchema.findByIdAndUpdate(id,fields)

    return await FilmSchema.findById(id).lean()
}