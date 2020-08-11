const mongoose = require('mongoose')
const Schema = mongoose.Schema

const listSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  toObject: {
    virtuals: true
  }
})

listSchema.virtual('stocks', {
  ref: 'Stock',
  localField: '_id',
  foreignField: 'list'
})

module.exports = mongoose.model('List', listSchema)
