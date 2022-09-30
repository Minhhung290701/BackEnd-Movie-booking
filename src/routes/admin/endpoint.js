const Router = require('@koa/router')
const {
    validateApiSchema: validate,
    validateAdminAccessToken: auth,
    unimplemented,
} = require('../../www/middleware')
const ctrl = require('./controller')
const schemas = require('./schema-api')

const router = new Router({ prefix: '/admin'})
router.use(auth)

router.post('/area', validate(schemas.addArea), ctrl.addArea)
router.del('/area/:id', validate(schemas.deleteArea), ctrl.deleteArea)
router.post('/cinema', validate(schemas.addCinema), ctrl.addCinema)

module.exports = [router]
