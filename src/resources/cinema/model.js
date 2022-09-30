const { v4: uuidv4 } = require('uuid')
const { hashPassword } = require('../../libs/utils')
const { Debug, errors, utils } = require('../../libs')
const { DuplicatedError, UnknownError, AuthenticationError, NotFoundError } = errors
const debug = require('../../libs/debug')()

const CinemaSchema = require('./schema-mg')

exports.creatCinema = async fields => {
    const cinema = await CinemaSchema.create(fields)

    return cinema
}