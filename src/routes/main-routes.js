const KoaRouter = require('koa-router')

const controllers = require('../controllers/index.js')

const router = new KoaRouter({ prefix: '/api' })

router
  .get('/public/get', function (ctx, next) {
    ctx.body = '禁止访问！'
  })
  .get('/file/list', controllers.file.GetList)
  .post('/file/upload', controllers.file.Upload)
  .get('/articles/:id', controllers.article.GetArticleById)
  .get('/articles', controllers.article.GetArticleList)
  .post('/articles', controllers.article.PostArticle)
  // .all('/upload', controllers.upload.default)
  // .get('/api/:name', controllers.api.Get)
  // .post('/api/:name', controllers.api.Post)
  // .put('/api/:name', controllers.api.Put)
  // .del('/api/:name', controllers.api.Delect)

module.exports = router
