const { v4: uuidv4 } = require('uuid')
const { hashPassword } = require('../../libs/utils')
const { Debug, errors, utils } = require('../../libs')
const { DuplicatedError, UnknownError, AuthenticationError, NotFoundError } = errors
const debug = require('../../libs/debug')()
var mongoose = require('mongoose');

const CinemaSchema = require('./schema-mg')
const { populate } = require('./schema-mg')

exports.creatCinema = async fields => {
    const cinema = await CinemaSchema.create(fields)

    return cinema
}

exports.deleteCinema = async id => {
    await CinemaSchema.deleteOne({_id:id})

    return 'success'
}

exports.getCinemas = async (limit, skip, areaId) => {
    debug.log(areaId)
    let total
    let cinemas
    if(!areaId) {
        total = await CinemaSchema.count()
        cinemas = await CinemaSchema.find({}).skip(skip).limit(limit)
        debug.log(cinemas)
    }
    else {
        areaId = mongoose.Types.ObjectId(areaId)
        total = await CinemaSchema.count({areaId:areaId})
        cinemas = await CinemaSchema.find({areaId:areaId}).skip(skip).limit(limit)
        debug.log(cinemas)
    }

    return {cinemas, total}
}

exports.getCinemasByAreaId = async areaId => {

    areaId = mongoose.Types.ObjectId(areaId)
    cinemas = await CinemaSchema.find({areaId:areaId}).lean()

    return cinemas
}

exports.getCinema = async id => {
    debug.log(12345)
    const cinema = await CinemaSchema.findById(id).lean()
    debug.log(cinema)

    return cinema
}