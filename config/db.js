'use strict'

const databaseName = 'stopwatch-api'

const localDb = `mongodb://localhost/${databaseName}`

const currentDb = process.env.MONGODB_URI || localDb

module.exports = currentDb
