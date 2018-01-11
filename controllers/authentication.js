const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../config')

function getToken(user) {
  const timestamp = new Date().getTime()
  return jwt.sign({sub: user.id, iat: timestamp }, config.secret)
}

exports.signup = function(req, res, next) {
  const { email, password } = req.body
  if(!email || !password) {
    return rest.status(422).send({ error: 'You must provide email and password' })
  }
  //if User with given email exists, return Error
  User.findOne({ email })
    .then( existingUser => {
  //422 unprocessable entity
      if(existingUser) {
        return res.status(422).send({error: 'Email already exists'})
      }
  //if User with given email does not exists, create and save user
      const user = new User({ email, password })
      return user.save()
    })
    .then( user => {
      res.status(200).send({ token: getToken(user) })
    }).catch( error => next(error) )
}

//give token when signin
exports.signin = function(req, res, next) {
  res.send({ token: getToken(req.user) })
}
