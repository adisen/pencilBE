const express = require('express')
const mongoose = require('mongoose')

const Topic = require('../models/Topics')

const router = express.Router()

router.get('/', async (req, res) => {
  const { query } = req.query
  try {
    const topics = await Topic.findById(query)
    const subtree = [...topics.children, query]

    mongoose.connection.db
      .collection('questions')
      .aggregate([
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
      .toArray((err, result) => {
        if (err) throw err
        res.json(result)
      })
  } catch (error) {
    console.log(error)
    res.status(500).send('Server Error')
  }
})

module.exports = router
