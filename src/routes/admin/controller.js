const { Area, Cinema } = require('../../resources')
const { utils, errors, Debug } = require('../../libs')

const debug = Debug()
const {
    NotFoundError,
    DataError,
    PermissionError,
    AuthenticationError,
    ValidationError,
    ConflictError,
    DuplicatedError
} = errors


exports.addArea = async ctx => {
    const {name} = ctx.request.body
    const area = await Area.Model.getAreaByName(name)
    if(area) {
        throw new DuplicatedError('Area exist')
    }

    await Area.Model.creatArea(name)

    ctx.body = 'success'
}

exports.deleteArea = async ctx => {
    const {id} = ctx.params
    debug.log(id)

    await Area.Model.deleteArea(id)

    ctx.body = 'success'
}

exports.addCinema = async ctx => {
    const fields = ctx.request.body

    const area = await Area.Model.getAreaById(fields.areaId)

    if(!area) {
        throw new ValidationError('Area does not exist')
    }
    fields.areaId =area._id
    const cinema = await Cinema.Model.creatCinema(fields)

    ctx.body = cinema
}