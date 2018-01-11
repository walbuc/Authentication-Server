const passport = require('passport')
const User = require('../models/user')
const config = require('../config')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local')

const localOptions = { usernameField: 'email'}
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  User.findOne({ email })
    .then(user => {
      if(!user) {
        done(null, false)
      } else {
        user.comparePasswords(password, (err, match) => {
          if(err) return done(err)
          if(!match) return done(null, false)
          return done(null, user)
        })
      }
    })
    .catch(err => done(err))
})

//Set up options for jwt Strategy
//cambiar esta opcion por bearer
const options = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
}

// create Strategy
// en vez de crear un objeto
// usar funcion y llamar promise en vez de callaback
// evitar usar new
// payload and done dentro de un objeto

const jwtLogin = new JwtStrategy(options, (payload, done) => {
  User.findById(payload.sub)
    .then(user => {
      if(user) {
        done(null, user)
      } else {
        done(null, false)
      }
    })
    .catch(err => done(err, false))
})

//Tell passport to use Strategy
passport.use(jwtLogin)
passport.use(localLogin)
