const express = require('express')
const connectDB = require('./db')
require('dotenv').config()

connectDB()

const app = express()

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.use('/api/search', require('./routes/search'))

const port = process.env | 5000
app.listen(port, () => {
  console.log(`App listening at port ${port}`)
})
