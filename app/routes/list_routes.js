const express = require('express')
const router = express.Router()

const List = require('../models/list')

const errors = require('../../lib/custom_errors')
const handle404 = errors.check404
const Unauthorized = errors.Unauthorized

const passport = require('passport')
const tokenAuth = passport.authenticate('bearer', { session: false })

router.get('/lists', tokenAuth, async (req, res, next) => {
  try {
    const docs = await List.find({ owner: req.user.id }).populate({path: 'stocks', select: 'tkr stop -list'})
    const lists = docs.map(doc => doc.toObject())
    res.status(200).json({ lists: lists })
  } catch (err) {
    next(err)
  }
})

router.get('/lists/:id', tokenAuth, async (req, res, next) => {
  try {
    const listId = req.params.id
    const list = await List.findOne({ owner: req.user.id, _id: listId }).populate({path: 'stocks', select: 'tkr stop -list'})
    handle404(list)
    res.status(200).json({ list: list.toObject() })
  } catch (err) {
    next(err)
  }
})

router.post('/lists', tokenAuth, async (req, res, next) => {
  try {
    const newList = req.body.list
    newList.owner = req.user.id
    const list = await List.create(newList)
    res.status(201).json({ list: list })
  } catch (err) {
    next(err)
  }
})

router.delete('/lists/:id', tokenAuth, async (req, res, next) => {
  try {
    const listId = req.params.id
    const list = await List.findById(listId)
    handle404(list)
    if (list.owner.toString() === req.user.id) {
      await list.remove()
      res.sendStatus(204)
    } else {
      throw new Unauthorized()
    }
  } catch (err) {
    next(err)
  }
})

module.exports = router
