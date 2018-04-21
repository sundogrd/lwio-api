const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SkillSchema = new Schema({
  name: { // 包括技能名+等级 比如小麦种植1
    type: String,
    unique: true,
    require: true
  },
  type: { // 只包括技能名
    type: String,
    required: true
  },
  description: { // 技能描述
    type: String
  },
  category: { // 技能类型，枚举类型["passive", "heal", "battle", "production"] 战斗技能再考虑
    type: String,
    require: true
  },
  upgrade_id: { // 升级到技能ID
    type: Schema.Types.ObjectId
  },
  facts: [{ // 技能产生的效果
    text: String,
    type: {
      type: String,
      enum: ['Buff']
    },
    icon: {
      type: String
    },
    duration: { // 持续时间，如果有的话
      type: Number
    },
    status: { // 状态的唯一标识，比如“AgriculturalBlessing”
      type: String
    }
  }],
  cost: {
    person: {
      stamina: Number,
      mana: Number
    },
    items_types: [{
      type: String
    }]
  }
})

SkillSchema.set('toObject', {
  transform: function (doc, ret, options) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
})

module.exports = mongoose.model('Skill', SkillSchema)
