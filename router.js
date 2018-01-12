const auth = require('./controllers/authentication')
const passportService = require('./services/passport')
const passport = require('passport')

const requireAuthorize = passport.authenticate('jwt', { session: false })
const requireSignin = passport.authenticate('local', { session: false })

module.exports = function(app) {

  app.get('/', requireAuthorize, (req, res) => {
    res.send({message: 'Hello from the backend side!'})
  })
  app.post('/signin', requireSignin , auth.signin)
  app.post('/signup', auth.signup)
}
