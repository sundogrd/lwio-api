const KoaRouter = require('koa-router')

const controllers = require('../controllers/index.js')

const router = new KoaRouter()

router
  .get('/public/get', function (ctx, next) {
    ctx.body = '禁止访问！'
  })
  .post('/api/file/upload', controllers.file.Upload)
  // .all('/upload', controllers.upload.default)
  // .get('/api/:name', controllers.api.Get)
  // .post('/api/:name', controllers.api.Post)
  // .put('/api/:name', controllers.api.Put)
  // .del('/api/:name', controllers.api.Delect)

module.exports = router
