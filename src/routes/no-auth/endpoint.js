const Router = require('@koa/router')
const { valid } = require('joi')
const {
    validateApiSchema: validate,
    validateAdminAccessToken: auth,
    unimplemented,
} = require('../../www/middleware')
const ctrl = require('./controller')
const schemas = require('./schema-api')

const router = new Router()

router.get('/banner', ctrl.getBanner)

router.get('/area/get-areas', validate(schemas.getAreas), ctrl.getAreas)

router.get('/cinema/get-cinemas', validate(schemas.getCinemas), ctrl.getCinemas)

router.get('/cinema/:id',validate(schemas.getCinema), ctrl.getCinema)

router.get('/film/get-films', validate(schemas.getListFilm), ctrl.getListFilm)

router.get('/film/get-film/:id', validate(schemas.getFilm), ctrl.getFilm)

router.get('/film-schedule/get-film-schedules', validate(schemas.getFilmSchedule), ctrl.getFilmSchedule)

router.get('/film-schedule/get-film-schedules-by-cinema', validate(schemas.getFilmSchedule), ctrl.getFilmScheduleByCinemaId)

router.get('/time/:id', validate(schemas.getTime), ctrl.getTime)

router.get('/new', validate(schemas.getNews), ctrl.getNews)


module.exports = [router]
