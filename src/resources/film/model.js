const { v4: uuidv4 } = require('uuid')
const { hashPassword } = require('../../libs/utils')
const { Debug, errors, utils } = require('../../libs')
const { DuplicatedError, UnknownError, AuthenticationError, NotFoundError } = errors
const debug = require('../../libs/debug')()

const FilmSchema = require('./schema-mg')

exports.creatFilm = async fields => {
    const film = await FilmSchema.create(fields)

    return film
}

exports.deleteFilm = async id => {
    await FilmSchema.deleteOne({_id:id})

    return 'success'
}

exports.getFilms = async (limit, skip) => {
    const total = await FilmSchema.count({})

    const films = await FilmSchema.find().sort({createdAt:-1}).skip(skip).limit(limit).lean()

    return {films, total}
}