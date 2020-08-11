const express = require('express')
const app = express()
const serverDevPort = 4741
const port = process.env.PORT || serverDevPort

// create database connection with mongoose
const mongoose = require('mongoose')
const db = require('./config/db')
mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true
})

const auth = require('./lib/authentication')

const errorHandler = require('./lib/error_handler')
const stockRoutes = require('./app/routes/stock_routes')
const listRoutes = require('./app/routes/list_routes')
const userRoutes = require('./app/routes/user_routes')

const requestLogger = require('./lib/request_logger')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(auth)
app.use(requestLogger)
app.use(userRoutes)
app.use(stockRoutes)
app.use(listRoutes)
app.use(errorHandler)

app.listen(port, () => console.log(`Example app listening on port: ${port}`))
