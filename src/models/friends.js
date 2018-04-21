const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FriendsSchema = new Schema({
  person_id: Schema.Types.ObjectId,
  friends: [{
    person_id: Schema.Types.ObjectId
  }]
})

FriendsSchema.set('toObject', {
  transform: function (doc, ret, options) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
})

module.exports = mongoose.model('Friends', FriendsSchema)
