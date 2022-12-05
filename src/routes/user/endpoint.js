const Router = require('@koa/router')
var crypto = require('crypto'); 
const {
    validateApiSchema: validate,
    validateAccessToken: auth,
    unimplemented,
} = require('../../www/middleware')
const ctrl = require('./controller')
const schemas = require('./schema-api')

const router = new Router({prefix:'/user'})
//router.use(auth)

router.put('/profile',auth, validate(schemas.updateProfile), ctrl.updateProfile)
router.get('/profile', auth, ctrl.getProfile)
router.post('/booking', auth, validate(schemas.booking), ctrl.booking)
//router.get('/vnpay_return',ctrl.vnpReturn)
router.get('/vnp_ipn', ctrl.vnpIpn)
router.get('/tickets',auth, validate(schemas.getTickets), ctrl.getTickets)
router.get('/ticket/:id', auth, validate(schemas.getTicket), ctrl.getTicket)
router.put('/ticket/readTicket', auth, validate(schemas.readTicket), ctrl.readTicket)

router.del('/tickets', auth, ctrl.deleteTicket)

module.exports = [router]
