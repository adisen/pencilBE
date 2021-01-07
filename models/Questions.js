const mongoose = require('mongoose')
const { Schema } = mongoose

const QuestionSchema = new Schema({
  _id: {
    type: Number,
    required: true
  },
  annotations: [{ type: String }]
})

module.exports = Question = mongoose.model('question', QuestionSchema)
