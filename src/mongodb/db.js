const mongoose = require('mongoose')
const DBConfig = require('../config').DB

mongoose.connect(DBConfig.url, {
  useMongoClient: true
})
mongoose.connection.on('connected', () => {
  console.log('Mongoose connection open to ' + DBConfig.url)
})
mongoose.connection.on('error', (error) => {
  console.error('Error in MongoDB connection: ' + error)
  mongoose.disconnect()
})

mongoose.connection.on('close', function () {
  console.log('Mongoose connection closed, waitting for reconnect')
  mongoose.connect(DBConfig.url, {server: {auto_reconnect: true}})
})

module.exports = mongoose.connection
