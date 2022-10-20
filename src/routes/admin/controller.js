const { Area, Cinema, Film, FilmSchedule} = require('../../resources')
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

exports.deleteCinema = async ctx => {
    const {id} = ctx.params

    await Cinema.Model.deleteCinema(id)

    ctx.body = 'success'
}

exports.addFilm = async ctx => {
    const fields = ctx.request.body
    fields.openingDay=new Date(fields.openingDay+"T00:00:00")

    debug.log(fields)

    const film = await Film.Model.creatFilm(fields)

    ctx.body = film
}


exports.deleteFilm = async ctx => {
    const {id} = ctx.params

    await Film.Model.deleteFilm(id)

    ctx.body = 'success'
}

exports.addFilmSchedule = async ctx => {
    const fields = ctx.request.body

    const checkTime = parseInt(fields.time.slice(11,13))
    if(checkTime<8) throw new DataError("Phim chỉ được chiếu từ 8h đến 24h")

    fields.time = new Date(fields.time.slice(0,10)+"T"+fields.time.slice(11,17))
    fields.numEmptySeat = 80

    debug.log(fields)
    let seats=[]
    for(let i=0; i < 80; i++) {
        seats.push({number:i+1, isBooked:false})
    }
    fields.seats = seats

    const filmSchedule = await FilmSchedule.Model.creatFilmSchedule(fields)

    ctx.body = filmSchedule
}