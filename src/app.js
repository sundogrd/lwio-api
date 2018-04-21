const Koa2 = require('koa')
const KoaBody = require('koa-body')
const KoaStatic = require('koa-static2')

const SystemConfig = require('./config').System
const DBConfig = require('./config').DB

const path = require('path')
const routes = require('./routes/index')
const ErrorRoutesCatch = require('./middleware/ErrorRoutesCatch')
const ErrorRoutes = require('./routes/error-routes')
const CORS = require('./middleware/CORS')

const customizedLogger = require('./tool/customized-winston-logger')

const jwt = require('jsonwebtoken')
const fs = require('fs')
const mongoose = require('mongoose')
// import PluginLoader from './lib/PluginLoader'

global.logger = customizedLogger

// mongoose.connect(DBConfig.url, {
//   useMongoClient: true
// })
// mongoose.connection.on('connected', () => {
//   console.log('Mongoose connection open to ' + DBConfig.url)
// })
// mongoose.connection.on('error', console.error)

const app = new Koa2()
const env = process.env.NODE_ENV || 'development' // Current mode

const publicKey = fs.readFileSync(path.join(__dirname, '../publicKey.pub'))

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
  .use((ctx, next) => {
    // if (ctx.request.header.host.split(':')[0] === 'localhost' || ctx.request.header.host.split(':')[0] === '127.0.0.1') {
    //   ctx.set('Access-Control-Allow-Origin', '*')
    // } else {
    //   ctx.set('Access-Control-Allow-Origin', SystemConfig.HTTP_server_host)
    // }
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Access-Token')
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
    ctx.set('Access-Control-Allow-Credentials', true) // 允许带上 cookie
    return next()
  })
  .use(ErrorRoutesCatch())
  .use(KoaStatic('assets', path.resolve(__dirname, '../assets'))) // Static resource
  // .use(KoaBody({
  //   multipart: true,
  //   strict: false,
  //   // formidable: {
  //   //   uploadDir: path.join(__dirname, '../assets/uploads/tmp')
  //   // },
  //   jsonLimit: '10mb',
  //   formLimit: '20mb',
  //   textLimit: '10mb'
  // })) // Processing request
  // .use(PluginLoader(SystemConfig.System_plugin_path))
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
