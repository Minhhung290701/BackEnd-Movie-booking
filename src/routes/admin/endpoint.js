const Router = require('@koa/router')
const { valid } = require('joi')
const {
    validateApiSchema: validate,
    validateAdminAccessToken: auth,
    unimplemented,
} = require('../../www/middleware')
const ctrl = require('./controller')
const schemas = require('./schema-api')

const router = new Router({ prefix: '/admin'})
router.use(auth)

router.post('/banner', validate(schemas.addBanner), ctrl.addBanner)
router.del('/banner/:id', validate(schemas.delete), ctrl.deleteBanner)
router.post('/area', validate(schemas.addArea), ctrl.addArea)
router.del('/area/:id', validate(schemas.delete), ctrl.deleteArea)
router.put('/area/:id', validate(schemas.update), ctrl.updateArea)
router.post('/cinema', validate(schemas.addCinema), ctrl.addCinema)
router.delete('/cinema/:id', validate(schemas.delete), ctrl.deleteCinema)
router.put('/cinema/:id', validate(schemas.update), ctrl.updateCinema)
router.post('/film', validate(schemas.addFilm), ctrl.addFilm)
router.delete('/film/:id', validate(schemas.delete), ctrl.deleteFilm)
router.put('/film/:id', validate(schemas.update), ctrl.updateFilm)
router.post('/film-schedule', validate(schemas.addFilmSchedule), ctrl.addFilmSchedule)
router.get('/user/get-users', validate(schemas.getUsers), ctrl.getUsers)
router.get('/user/get-locked-users', validate(schemas.getUsers), ctrl.getLockedUsers )
router.delete('/user/:id', validate(schemas.delete), ctrl.deleteAndUnDeleteUser)

module.exports = [router]
