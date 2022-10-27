const Router = require('@koa/router')
const {
    validateApiSchema: validate,
    validateAccessToken: auth,
    unimplemented,
} = require('../../www/middleware')
const ctrl = require('./controller')
const schemas = require('./schema-api')

const router = new Router({prefix:'/user'})
router.use(auth)

router.put('/profile', validate(schemas.updateProfile), ctrl.updateProfile)
router.get('/profile', ctrl.getProfile)
router.post('/booking/web', validate(schemas.booking), ctrl.bookingWeb)

module.exports = [router]
