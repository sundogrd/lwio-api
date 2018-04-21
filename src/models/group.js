const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GroupSchema = new Schema({
  name: {
    type: String,
    unique: true,
    require: true
  },
  type: {
    type: String,
    require: true
  },
  icon: String,
  sub_group: {
    type: [Schema.Types.ObjectId]
  },
  level: {
    type: Number
  },
  totalMember: {
    type: Number
  },
  relationship: {
    positive: [Schema.Types.ObjectId],
    negtive: [Schema.Types.ObjectId]
  },
  time: {
    type: Date
  },
  description: {
    type: String
  },
  influence: Number
})

GroupSchema.set('toObject', {
  transform: function (doc, ret, options) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
})

module.exports = mongoose.model('Group', GroupSchema)
