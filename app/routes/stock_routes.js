const express = require('express')
const router = express.Router()

const Stock = require('../models/stock')

const errors = require('../../lib/custom_errors')

const handle404 = errors.check404

router.get('/stocks', (req, res, next) => {
  Stock.find()
    .then(stocks => {
      res.status(200).json({stocks: stocks})
    })
    .catch(next)
})

router.post('/stocks', (req, res, next) => {
  const newStock = req.body.stock

  Stock.create(newStock)
    .then(stock => {
      res.status(201).json({stock: stock})
    })
    .catch(next)
})

router.delete('/stocks/:id', (req, res, next) => {
  const stockId = req.params.id
  Stock.findByIdAndDelete(stockId)
    .then(doc => {
      handle404(doc)
      res.sendStatus(204)
    })
    .catch(next)
})

module.exports = router
