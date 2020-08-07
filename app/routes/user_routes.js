const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const errors = require('../../lib/custom_errors')
const BadCredentials = errors.BadCredentials
const DocumentNotFound = errors.DocumentNotFound

const User = require('../models/user')

router.post('/sign-up', (req, res, next) => {
  const credentials = req.body.credentials
  createUser(credentials)

  async function createUser (creds) {
    try {
      if (creds.email && creds.password === creds.password_confirmation) {
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
  }
})

router.post('/sign-in', (req, res, next) => {
  const credentials = req.body.credentials
  findUser(credentials)
  async function findUser (creds) {
    try {
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
  }
})

router.patch('/change-pw', (req, res, next) => {
  const passwords = req.body.passwords
  const userId = passwords.id
  updatePassword(passwords)
  async function updatePassword (passwords) {
    try {
      const user = await User.findById(userId)
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
  }
})

router.delete('/sign-out', (req, res, next) => {
  const userId = '5f2d994736be0558d06f2136'
  signOut()
  async function signOut () {
    try {
      const user = await User.findById(userId)
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
  }
})

module.exports = router
