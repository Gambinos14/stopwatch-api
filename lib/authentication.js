const BearerStrategy = require('passport-http-bearer').Strategy

const User = require('../app/models/user')

const strategy = new BearerStrategy(
  function (token, done) {
    User.findOne({ token: token }, function (err, user) {
      if (err) { return done(err) }
      if (!user) { return done(null, false) }
      return done(null, user, { scope: 'all' })
    })
  }
)

module.exports = strategy
