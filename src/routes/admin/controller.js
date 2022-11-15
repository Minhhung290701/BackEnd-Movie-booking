const { Area, Cinema, Film, FilmSchedule, Profile, Banner} = require('../../resources')
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


exports.addBanner = async ctx => {
    const fields = ctx.request.body

    const banner = await Banner.Model.creatBanner(fields)

    ctx.body = banner
}

exports.deleteBanner = async ctx => {
    const {id} = ctx.params
    debug.log(id)

    await Banner.Model.deleteBanner(id)

    ctx.body = 'success'
}


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

exports.updateArea = async ctx => {
    const {id} = ctx.params
    const fields = ctx.request.body

    const area = await Area.Model.updateArea(id, fields)

    ctx.body = area
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

exports.updateCinema = async ctx => {
    const {id} = ctx.params
    const fields = ctx.request.body

    const cinema = await Cinema.Model.updateCinema(id, fields)

    ctx.body = cinema
}

exports.addFilm = async ctx => {
    const fields = ctx.request.body
    fields.openingDay=new Date(fields.openingDay)

    debug.log(fields)

    const film = await Film.Model.creatFilm(fields)

    ctx.body = film
}


exports.deleteFilm = async ctx => {
    const {id} = ctx.params

    await Film.Model.deleteFilm(id)

    ctx.body = 'success'
}

exports.updateFilm = async ctx => {
    const {id} = ctx.params
    const fields = ctx.request.body

    const film = await Film.Model.updateFilm(id, fields)

    ctx.body = film
}

exports.addFilmSchedule = async ctx => {
    const fields = ctx.request.body
    const film = await Film.Model.getFilmById(fields.filmId)
    if(!film) {
        throw new NotFoundError('Not found film')
    }
    const cinema = await Cinema.Model.getCinema(fields.cinemaId)
    if(!cinema) {
        throw new NotFoundError('Not found cinema')
    }
    if(!cinema.room.includes(parseInt(fields.room))) {
        throw new NotFoundError('Not found room in cinema')
    }


    //const checkTime = parseInt(fields.time.slice(11,13))
    //if(checkTime<8) throw new DataError("Phim chỉ được chiếu từ 8h đến 24h")

    fields.time = new Date(fields.time)
    fields.numEmptySeat = 80
    const checkSchedule = await FilmSchedule.Model.checkExist(fields.cinemaId, fields.time, film.durationMin)
    if(!checkSchedule) {
        throw new DataError('There is a movie playing in theaters during this time')
    }
    debug.log(fields)
    let seats=[]
    for(let i=0; i < 80; i++) {
        seats.push({number:i+1, isBooked:false})
    }
    fields.seats = seats

    const filmSchedule = await FilmSchedule.Model.creatFilmSchedule(fields)
    debug.log(filmSchedule)
    delete filmSchedule.seats

    ctx.body = filmSchedule
}


exports.getUsers = async ctx => {
    const limit = parseInt(ctx.query.limit || '20')
    const skipPage = parseInt(ctx.query.skipPage || '0')
    const skip = parseInt(skipPage || '0') * limit

    const {users, total} = await Profile.Model.getProfiles(limit,skip)

    ctx.state.paging = utils.generatePaging(skipPage, limit, total)

    ctx.body = users
}


exports.getLockedUsers = async ctx => {
    const limit = parseInt(ctx.query.limit || '20')
    const skipPage = parseInt(ctx.query.skipPage || '0')
    const skip = parseInt(skipPage || '0') * limit

    const {users, total} = await Profile.Model.getLockedProfiles(limit,skip)

    ctx.state.paging = utils.generatePaging(skipPage, limit, total)

    ctx.body = users
}

exports.deleteAndUnDeleteUser = async ctx => {
    const {id} = ctx.params

    await Profile.Model.deleteUndeleteUser(id)

    ctx.body = 'success'
}

