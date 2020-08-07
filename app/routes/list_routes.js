const express = require('express')
const router = express.Router()

const List = require('../models/list')

const errors = require('../../lib/custom_errors')

const handle404 = errors.check404

router.get('/lists', (req, res, next) => {
  List.find().populate({path: 'stocks', select: 'tkr -list'})
    .then(docs => docs.map(doc => doc.toObject()))
    .then(lists => res.status(200).json({lists: lists}))
    .catch(next)
})

router.get('/lists/:id', (req, res, next) => {
  const listId = req.params.id
  List.findById(listId)
    .then(doc => {
      handle404(doc)
    })
    .then(list => res.status(200).json({list: list.toObject()}))
    .catch(next)
})

router.post('/lists', (req, res, next) => {
  const newList = req.body.list
  List.create(newList)
    .then(list => res.status(201).json({list: list}))
    .catch(next)
})

router.delete('/lists/:id', (req, res, next) => {
  const listId = req.params.id
  List.findByIdAndDelete(listId)
    .then(doc => {
      handle404(doc)
      res.sendStatus(204)
    })
    .catch(next)
})

module.exports = router
