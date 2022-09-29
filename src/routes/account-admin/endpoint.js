const Router = require('@koa/router')
const {
    validateApiSchema: validate,
    validateAccessToken: auth,
    unimplemented,
} = require('../../www/middleware')
const ctrl = require('./controller')
const schemas = require('./schema-api')

const router = new Router({ prefix: '/admin/auth'})

router.post('/register', ctrl.register)
router.post('/login',validate(schemas.login), ctrl.login)

module.exports = [router]
