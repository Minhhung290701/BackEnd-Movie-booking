const Router = require('@koa/router')

const ctrl = require('./controller')

const router = new Router({ prefix: '/healthz'} )
router.get('/', ctrl.healthz)

module.exports = [router]
