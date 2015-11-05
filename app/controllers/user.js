(function () {

  var User = require('./../models/user.js');

  module.exports = {

    getUser: function(req, res) {
      console.log("--------1");
      res.json( portfolioTrimmer(req.user.portfolio));
    },
    
    changePass: function(req, res) {
      //Check old Password and change password
      res.json(req.user.history);
    },

    resetPass: function(req, res) {
      //Check Token and change password
      res.json(req.user.history);
    },

    forgot: function(req, res) {
      //Send out forget email
      res.json(req.user.history);
    },
   
  }

}());

