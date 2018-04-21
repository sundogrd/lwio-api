const compose = require('koa-compose')
const mainRoutes = require('./main-routes')
const fileRoutes = require('./file')


const router = compose([
  mainRoutes.routes(),
  mainRoutes.allowedMethods(),
  fileRoutes.routes(),
  fileRoutes.allowedMethods(),
])

module.exports = router
