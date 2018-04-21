const KoaRouter = require('koa-router')

const controllers = require('../controllers/index.js')

const router = new KoaRouter({ prefix: 'api/file' })

router
  .post('/upload', controllers.file.Upload)

module.exports = router
