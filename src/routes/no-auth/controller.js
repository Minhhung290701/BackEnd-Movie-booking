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
    debug.log(124)
    const {id} = ctx.params

    const cinema = await Cinema.Model.getCinema(id)

    ctx.body = cinema
}

exports.getListFilm = async ctx => {
    const limit = parseInt(ctx.query.limit || '20')
    const skipPage = parseInt(ctx.query.skipPage || '0')
    const skip = parseInt(skipPage || '0') * limit

    const {films, total} = await Film.Model.getFilms(limit,skip)

    ctx.state.paging = utils.generatePaging(skipPage, limit, total)

    ctx.body = films
}


exports.getFilmSchedule = async ctx => {
    const {cinemaId, filmId, date} = ctx.query
    debug.log(cinemaId,filmId)
    const filmSchedules = await FilmSchedule.Model.getFilmSchedule(cinemaId, filmId, date)

    await Promise.all(
        filmSchedules.map(async filmSchedule => {
            delete filmSchedule.seats
            delete filmSchedule.createdAt
            delete filmSchedule.updatedAt
            delete filmSchedule.__v
        })
    )

    ctx.body = filmSchedules

}