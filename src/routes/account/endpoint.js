const Router = require('@koa/router')
const {
    validateApiSchema: validate,
    validateAccessToken: auth,
    unimplemented,
} = require('../../www/middleware')
const ctrl = require('./controller')
const schemas = require('./schema-api')

const router = new Router({ prefix: '/auth'})

router.post('/register', validate(schemas.register), ctrl.register)
router.post('/login',validate(schemas.login), ctrl.login)
router.put('/password',auth, validate(schemas.changePassword), ctrl.changePassword)
router.post('/forgot-password', validate(schemas.forgotPassword), ctrl.forgotPassword)
router.post(
    '/verify-token-forgot-password',
    validate(schemas.verifyTokenForgotPassword),
    ctrl.verifyTokenForgotPassword,
)

module.exports = [router]
