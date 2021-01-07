const express = require('express')
const mongoose = require('mongoose')

const Topic = require('../models/Topics')

const router = express.Router()

router.get('/', async (req, res) => {
  const { query } = req.query
  try {
    const topics = await Topic.findById(query)
    const subtree = [...topics.children, query]
    const questionNumbers = []

    const result = mongoose.connection.db.collection('questions').aggregate([
      { $match: { annotations: { $in: subtree } } },
      {
        $project: {
          tagMatch: {
            $setIntersection: ['$annotations', subtree]
          },
          sizeMatch: {
            $size: {
              $setIntersection: ['$annotations', subtree]
            }
          }
        }
      },
      { $match: { sizeMatch: { $gte: 1 } } },
      { $project: { tagMatch: 1 } }
    ])

    result.toArray((err, results) => {
      if (err) throw err
      results.forEach(result => {
        questionNumbers.push(result._id)
      })

      res.send(questionNumbers)
    })
  } catch (error) {
    console.log(error)
    res.status(500).send('Server Error')
  }
})

module.exports = router
