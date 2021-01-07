const mongoose = require('mongoose')
const { Schema } = mongoose

const TopicSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  children: [{ type: String }]
})

const Topic = mongoose.model('topic', TopicSchema)
module.exports = Topic
