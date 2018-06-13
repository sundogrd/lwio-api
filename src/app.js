const Koa2 = require('koa')
const KoaBody = require('koa-body')

const SystemConfig = require('./config').System

const path = require('path')
const routes = require('./routes/index')
const ErrorRoutes = require('./routes/error-routes')

// const CORS = require('./middleware/CORS')
const ErrorRoutesCatch = require('./middleware/ErrorRoutesCatch')
const LwStatic = require('./middleware/lw-static')
const LwRange = require('./middleware/lw-range')

const customizedLogger = require('./tool/customized-winston-logger')
require('./mongodb/db') // 直接连接数据库，不需要使用db

// const jwt = require('jsonwebtoken')

// import PluginLoader from './lib/PluginLoader'

global.logger = customizedLogger

const app = new Koa2()
const env = process.env.NODE_ENV || 'development' // Current mode

// const publicKey = fs.readFileSync(path.join(__dirname, '../publicKey.pub'))

if (env === 'development') { // logger
  app.use((ctx, next) => {
    const start = new Date()
    return next().then(() => {
      const ms = new Date() - start
      logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`)
    })
  })
}

app
  .use(KoaBody())
  .use((ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Access-Token')
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
    ctx.set('Access-Control-Allow-Credentials', true) // 允许带上 cookie
    return next()
  })
  .use(ErrorRoutesCatch())
  .use(LwRange)
  .use(LwStatic('api/storeroom', path.resolve(__dirname, '../storeroom')))
  .use(routes)
  .use(ErrorRoutes())
app.listen(SystemConfig.API_server_port)

process.on('uncaughtException', function (err) {
  // 打印出错误
  console.log('unhandlerr:' + err)
  // 打印出错误的调用栈方便调试
  console.log(err.stack)
})
console.log('Now start API server on port ' + SystemConfig.API_server_port + '...')

module.exports = app
