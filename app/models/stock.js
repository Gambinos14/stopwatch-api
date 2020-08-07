const mongoose = require('mongoose')
const Schema = mongoose.Schema

const stockSchema = new Schema({
  tkr: {
    type: String,
    required: true
  },
  stop: {
    type: Number,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  list: {
    type: Schema.Types.ObjectId,
    ref: 'List',
    required: true
  }
})

module.exports = mongoose.model('Stock', stockSchema)
