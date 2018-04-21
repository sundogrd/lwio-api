const Item = require('./item')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// pre remove
const UserSchema = require('./user')

const PersonSchema = new Schema({
  // CORE PART
  user_id: {
    type: String
  },
  nickname: {
    type: String,
    unique: true,
    require: true
  },
  race: { // 扩展字段，暂时没用
    type: String
  },
  gender: {
    type: String,
    enum: ['male', 'female']
  },
  age: { // 角色年龄
    type: Number
  },
  position: {
    lat: {
      type: Number
    },
    lon: {
      type: Number
    }
  },
  current: { // 现在的状态
    type: String,
    enum: ['in battle', 'moving', 'waitting', 'working']
  },

  items: [{
    type: Schema.Types.ObjectId,
    ref: 'Item'
  }],
  conditions: { // 当前状态
    health: { // 健康
      type: Number
    },
    maxHealth: { // 健康最大值
      type: Number
    },
    stamina: { // 耐力
      type: Number
    },
    maxStamina: { // 耐力最大值
      type: Number
    }
  },
  status: [],
  attributes: { // 基本六维
    str: {
      type: Number
    },
    dex: {
      type: Number
    },
    con: {
      type: Number
    },
    int: {
      type: Number
    },
    wis: {
      type: Number
    },
    cha: {
      type: Number
    }
  },
  description: String,
  // // GUILD PART
  // guilds: [ // 加入的工会ID集

  // ],
  // guild: { // 当前展示工会ID，参考激战2
  //   type: String
  // },
  // guild_leader: [ // 领导的工会

  // ],

  created_at: { // 人物创建时间
    type: Date
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

PersonSchema.set('toObject', {
  transform: function (doc, ret, options) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
})

PersonSchema.pre('remove', function (next) {
  UserSchema.findOneAndUpdate({person_id: this._id}, {person_id: null}).exec()
  next()
})

PersonSchema.statics.findByIdAndCreateItem = async function (data, cb) {
  new Item({
    owner_id: data.id,
    name: data.name,
    targetType: [''],
    type: data.type || 'other',
    status: data.status || 'active',
    result: null,
    des: data.des || '',
    needs: data.needs
  }).save((err, item) => {
    if (err) {
      console.log('findByIdAndCreateBelong error:' + err)
      throw new Error(err)
    }
    this.findById(data.id)
      .exec((err, person) => {
        if (err) {
          throw new Error(err)
        }
        person.items.push(item._id)
        person.save((err, person) => {
          if (err) {
            console.log('person create item update failed!')
            throw new Error(err)
          }
          console.log('peson create item successful!')
          typeof cb === 'function' && cb()
        })
      })
  })
}

PersonSchema.statics.findByIdAndRemoveItem = async function (personId, itemId, cb) {
  Item.findByIdAndRemove(itemId)
    .exec((err, belong) => {
      if (err) {
        console.log('findByIdAndRemoveBelong err: ' + err)
        throw new Error(err)
      }
    })
  this.findById(personId)
    .select('items')
    .exec((err, person) => {
      if (err) {
        console.log('findByIdAndRemoveBelong err: ' + err)
        throw new Error(err)
      }
      let index = person.items.findIndex((cur, index) => {
        return cur._id === itemId
      })

      person.items.splice(index, 1)
      person.save((err, person) => {
        if (err) {
          throw new Error(err)
        }
        console.log('use belong successful!')
        typeof cb === 'function' && cb()
      })
    })
}

module.exports = mongoose.model('Person', PersonSchema)
