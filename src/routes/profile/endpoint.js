const Router = require('@koa/router')
const {
    validateApiSchema: validate,
    validateAccessToken: auth,
    unimplemented,
} = require('../../www/middleware')
const ctrl = require('./controller')
const schemas = require('./schema-api')

const router = new Router({ prefix: '/profile'} )
router.use(auth)

router.put('/', validate(schemas.updateProfile), ctrl.updateProfile)

module.exports = [router]
