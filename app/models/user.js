// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    email        : String,
    password     : String
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(passwd) {
  return bcrypt.compareSync(passwd, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
