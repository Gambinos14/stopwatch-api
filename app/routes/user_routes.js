const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const errors = require('../../lib/custom_errors')
const BadCredentials = errors.BadCredentials
const DocumentNotFound = errors.DocumentNotFound

const passport = require('passport')
const tokenAuth = passport.authenticate('bearer', { session: false })

const User = require('../models/user')

router.post('/sign-up', async (req, res, next) => {
  try {
    const creds = req.body.credentials
    if (creds.email && creds.password === creds.passwordConfirmation) {
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(creds.password, salt)
      const user = {
        email: creds.email,
        hashedPassword: hash
      }
      const newUser = await User.create(user)
      res.status(201).json({ user: newUser.toObject() })
    } else {
      throw new BadCredentials()
    }
  } catch (err) {
    next(err)
  }
})

router.post('/sign-in', async (req, res, next) => {
  try {
    const creds = req.body.credentials
    const user = await User.findOne({ email: creds.email })
    if (!user) {
      throw new DocumentNotFound()
    }
    const checkPassword = await bcrypt.compare(creds.password, user.hashedPassword)
    if (!checkPassword) {
      throw new BadCredentials()
    }
    const token = crypto.randomBytes(16).toString('hex')
    user.token = token
    await user.save()
    res.status(201).json({ user: user.toObject() })
  } catch (err) {
    next(err)
  }
})

router.patch('/change-pw', tokenAuth, async (req, res, next) => {
  try {
    const passwords = req.body.passwords
    const user = await User.findById(req.user.id)
    if (!user) {
      throw new DocumentNotFound()
    }
    const check = await bcrypt.compare(passwords.oldpw, user.hashedPassword)
    if (!check) {
      throw new BadCredentials()
    }
    const salt = await bcrypt.genSalt(10)
    const newHash = await bcrypt.hash(passwords.newpw, salt)
    user.hashedPassword = newHash
    await user.save()
    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
})

router.delete('/sign-out', tokenAuth, async (req, res, next) => {
  try {
    const user = req.user
    if (!user) {
      return new BadCredentials()
    }
    const newToken = crypto.randomBytes(16).toString('hex')
    user.token = newToken
    await user.save()
    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
})

module.exports = router
