(function () {

  var User = require('./../models/user.js');
  var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
  var configDB = require('../../config/database.js');

  module.exports = {

    getUser: function(req, res) {
      res.json({name: req.user.name, email: req.user.email});
    },
    changeUser: function(req, res) {
      if(req.body.name) {
        req.user.name = req.body.name;
        req.user.save(function(err) {
          if (err) return res.json(err);
          console.log("Changed name");
          res.json({ success: true, message: 'Changed Name' }); 
        });

      } else {
          res.send('Nothing to change', 400); 
      }
    },
    
    changePass: function(req, res) {
      //If there is a token and no password on account make password new password
      //if the old pass matches the password make new pass 
      //auth token {auth_token: x}
      if(req.body.auth_token || (req.user.validPassword(req.body.oldPassword))) {
        req.user.password = req.user.generateHash(req.body.password);
        req.user.save(function(err) {
          if (err) return res.json(err);
          console.log("Changed Password");
          var token = jwt.sign({'sub': req.user._id}, configDB.secret, {
            expiresIn: 1440 * 60
          });

          res.json({token: token});
        });

      } else {
          res.send('Old Password is incorrect', 400); 
      }
    },

    forgot: function(req, res) {
      User.findOne({email: req.body.email}, function (err, myDocument) {
        var user = myDocument;
        if (!user) {
          res.send('Authentication failed.', 400); 
        }
        var token = jwt.sign({'sub': user._id}, configDB.secret, {
          expiresIn:  30 * 60
        });
        console.log("http://localhost:9000/password/" + token);
        res.json("Password Reset Email Sent");
      });
    },
   
  }

}());

