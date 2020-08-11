const handleErrors = function (err, req, res, next) {
  if (err.name.match(/Valid/) || err.name === 'MongoError') {
    const message = 'The received data failed validation'
    err = { status: 422, message: message}
  } else if (err.name === 'DocumentNotFound') {
    err.status = 404
  } else if (err.name === 'CastError' || err.name === 'BadCredentials' || err.name === 'TypeError') {
    err.status = 422
  } else if (err.name === 'Unauthorized') {
    err.status = 401
  }

  console.error("I'm handling err: ", err)
  res.status(err.status || 500).json({err: err.message})
}

module.exports = handleErrors
