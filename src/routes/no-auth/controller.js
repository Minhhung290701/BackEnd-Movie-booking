const { Area, Cinema, Film, FilmSchedule, Banner} = require('../../resources')
const { utils, errors, Debug } = require('../../libs')
const {VNP_TMNCODE, VNP_HASHSECRET, VNP_URL, VNP_RETURNURL} = process.env

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


exports.getBanner = async ctx => {
    const banner = await Banner.Model.getBanners()
    ctx.body = banner
}

exports.getAreas = async ctx => {
    const limit = parseInt(ctx.query.limit || '20')
    const skipPage = parseInt(ctx.query.skipPage || '0')
    const skip = parseInt(skipPage || '0') * limit
    
    const {areas, total} = await Area.Model.getAreas(limit,skip)

    ctx.state.paging = utils.generatePaging(skipPage, limit, total)

    await Promise.all(
        areas.map(async area=> {
            const cinemas = await Cinema.Model.getCinemasByAreaId(area._id)
            area.cinemas = cinemas
        }),
    )
    
    
    ctx.body = areas
}

/* exports.getCinemas = async ctx => {
    const limit = parseInt(ctx.query.limit || '20')
    const skipPage = parseInt(ctx.query.skipPage || '0')
    const areaId = ctx.query.areaId
    const skip = parseInt(skipPage || '0') * limit

    const {cinemas, total} = await Cinema.Model.getCinemas(limit, skip, areaId)

    ctx.state.paging = utils.generatePaging(skipPage, limit, total)

    ctx.body = cinemas
} */

exports.getCinema = async ctx => {
    const {id} = ctx.params

    const cinema = await Cinema.Model.getCinema(id)

    ctx.body = cinema
}

exports.getCinemas = async ctx => {
    const limit = parseInt(ctx.query.limit || '20')
    const skipPage = parseInt(ctx.query.skipPage || '0')
    const skip = parseInt(skipPage || '0') * limit
    const areaId = ctx.query.areaId
    const {cinemas, total} = await Cinema.Model.getCinemas(limit,skip, areaId)

    ctx.state.paging = utils.generatePaging(skipPage, limit, total)

    ctx.body = cinemas
}

exports.getListFilm = async ctx => {
    const type = ctx.query.type
    const limit = parseInt(ctx.query.limit || '20')
    const skipPage = parseInt(ctx.query.skipPage || '0')
    const skip = parseInt(skipPage || '0') * limit

    const {films, total} = await Film.Model.getFilms(limit,skip,type)

    ctx.state.paging = utils.generatePaging(skipPage, limit, total)

    ctx.body = films
}

exports.getFilm = async ctx => {
    const {id} = ctx.params
    const film = await Film.Model.getFilmById(id)
    debug.log(123)

    ctx.body = film
}


exports.getFilmSchedule = async ctx => {
    const {areaId, cinemaId, filmId, date} = ctx.query
    debug.log(cinemaId,filmId)
    let data = await FilmSchedule.Model.getFilmSchedule(areaId,filmId, date)

/*     await Promise.all(
        filmSchedules.map(async filmSchedule => {
            delete filmSchedule.seats
            delete filmSchedule.createdAt
            delete filmSchedule.updatedAt
            delete filmSchedule.__v
        })
    ) */

    ctx.body = data
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }
  
  function formatDate(date) {
    return [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('/');
  }

exports.getTime = async ctx => {
    const {id} = ctx.params
    const film = await Film.Model.getFilmById(id)

    const now = formatDate(new Date())
    let today =  new Date(now)
    let times=[]
    mili = today.getTime()
    for (let i = 0; i< 6 ; i++) {
        const date = new Date(mili+i*86400000)
        const check = await FilmSchedule.Model.checkExistInDate(film._id, date)
        if(check) {
            times.push(date)
        }
    }

    ctx.body = times
}
