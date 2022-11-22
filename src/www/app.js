const Koa = require('koa')
const koaBody = require('koa-body')
const compress = require('koa-compress')
const zlib = require('zlib')
const cors = require('cors')

const router = require('./router')
const responseHandler = require('./response-handler')

const app = new Koa()

app.use(
    compress({
        filter(content_type) {
            return /text|application\/json/i.test(content_type)
        },
        threshold: 2048,
        gzip: {
            flush: zlib.Z_SYNC_FLUSH,
        },
        deflate: {
            flush: zlib.Z_SYNC_FLUSH,
        },
        br: {
            flush: zlib.Z_SYNC_FLUSH,
        },
    }),
)

app.use(
    koaBody({
        multipart: true,
        formidable: {
            uploadDir: process.env.UPLOAD_DIR, // directory where files will be uploaded
            keepExtensions: true, // keep file extension on upload
            multiples: true,
        },
        urlencoded: true,
        formLimit: process.env.FORM_LIMIT,
    }),
)

app.use(cors())

app.use(responseHandler) // always above routes & below compress
app.use(router.routes())

module.exports = app

// print all routes
// setTimeout(() => {
//     router.stack.forEach(i => console.log(i.path))
// }, 2000)
