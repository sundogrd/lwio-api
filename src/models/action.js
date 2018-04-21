const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ActionSchema = new Schema({
  owner_id: {
    type: Schema.Types.ObjectId
  },
  name: {
    type: String,
    unique: true,
    require: true
  },
  duration: {
    type: Date
  },
  type: {
    type: String,
    require: true
  },
  des: {
    type: String
  },
  disperseable: {
    type: String
  },
  results: {}
})

ActionSchema.set('toObject', {
  transform: function (doc, ret, options) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
})

module.exports = mongoose.model('Action', ActionSchema)
