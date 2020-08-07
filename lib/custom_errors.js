// constructor() defines the constructor function for our custom errors
// super() calls the parents' constructor function to inherit all properties and methods
// underneath we can overwrite any properties or methods for this new custom error

class DocumentNotFound extends Error {
  constructor () {
    super()
    this.name = 'DocumentNotFound'
    this.message = "The provided parameters don't match anything in our records"
  }
}

class BadCredentials extends Error {
  constructor () {
    super()
    this.name = 'BadCredentials'
    this.message = 'The provided credentials are incorrect or don\'t pass validation'
  }
}

const check404 = function (document) {
  if (!document) {
    throw new DocumentNotFound()
  } else {
    return document
  }
}

module.exports = {
  check404,
  BadCredentials,
  DocumentNotFound
}
