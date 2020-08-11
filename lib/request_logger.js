const requestLogger = (req, res, next) => {
  console.log(`
    ---------------------------------
    Incomming request ${new Date()}
    ${req.method} ${req.path}
    Body: ${JSON.stringify(req.body)}
    ---------------------------------
    `)
  next()
}

module.exports = requestLogger
