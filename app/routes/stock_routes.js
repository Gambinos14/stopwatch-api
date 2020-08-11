const express = require('express')
const router = express.Router()

const Stock = require('../models/stock')

const errors = require('../../lib/custom_errors')
const handle404 = errors.check404
const Unauthorized = errors.Unauthorized

const passport = require('passport')
const tokenAuth = passport.authenticate('bearer', { session: false })

router.get('/stocks', tokenAuth, async (req, res, next) => {
  try {
    const stocks = await Stock.find({ owner: req.user.id })
    res.status(200).json({ stock: stocks })
  } catch (err) {
    next(err)
  }
})

router.post('/stocks', tokenAuth, async (req, res, next) => {
  try {
    const newStock = req.body.stock
    newStock.owner = req.user.id
    const stock = await Stock.create(newStock)
    res.status(201).json({ stock: stock })
  } catch (err) {
    next(err)
  }
})

router.delete('/stocks/:id', tokenAuth, async (req, res, next) => {
  try {
    const stockId = req.params.id
    const stock = await Stock.findById(stockId)
    handle404(stock)
    if (stock.owner.toString() === req.user.id) {
      await stock.remove()
      res.sendStatus(204)
    } else {
      throw new Unauthorized()
    }
  } catch (err) {
    next(err)
  }
})

module.exports = router
