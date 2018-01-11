const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

//Define model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
})

//On save hook, encrypt password with bcrypt
userSchema.pre('save', function (next) {
  bcrypt.genSalt(10, (error, salt) => {
    if(error) return next(error)
    bcrypt.hash(this.password, salt, null, (error, hash) => {
      if(error) return next(error)
      this.password = hash
      next()
    })
  })
})

//This method will be used in auth local strategy
//hacerlo promise
userSchema.methods.comparePasswords = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, match) => {
    if(err) return cb(err)
    cb(null, match)
  })
}

//Create model class
const modelClass = mongoose.model('user', userSchema)

//Export it
module.exports = modelClass
