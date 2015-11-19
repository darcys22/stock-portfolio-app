(function () {

  var User = require('./../models/user.js');
  var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
  var config = require('../../config/config.js');
  var util = require('util');

  module.exports = {

    getUser: function(req, res) {
      res.json({name: req.user.name, email: req.user.email});
    },
    changeUser: function(req, res) {
      req.checkBody('name', 'Invalid name').notEmpty().isAlpha();
      var errors = req.validationErrors();
      if (errors) {
        res.send('There have been validation errors: ' + util.inspect(errors), 400);
        return;
      }

      req.user.name = req.body.name;
      req.user.save(function(err) {
        if (err) return res.json(err);
        res.json({ success: true, message: 'Changed Name' }); 
      });

    },
    
    changePass: function(req, res) {
      req.checkBody(['oldPassword', 'password'], 'Invalid Pass').notEmpty();
      var errors = req.validationErrors();
      if (errors) {
        res.send('There have been validation errors: ' + util.inspect(errors), 400);
        return;
      }

      //If there is a token and no password on account make password new password
      //if the old pass matches the password make new pass 
      //auth token {auth_token: x}
      if(req.body.auth_token || (req.user.validPassword(req.body.oldPassword))) {
        req.user.password = req.user.generateHash(req.body.password);
        req.user.save(function(err) {
          if (err) return res.json(err);
          var token = jwt.sign({'sub': req.user._id}, config.secret, {
            expiresIn: 1440 * 60
          });

          res.json({token: token});
        });

      } else {
          res.send('Old Password is incorrect', 400); 
      }
    },

    forgot: function(req, res) {
      req.checkBody(['email'], 'Invalid Email').notEmpty().isEmail();
      var errors = req.validationErrors();
      if (errors) {
        res.send('There have been validation errors: ' + util.inspect(errors), 400);
        return;
      }
      User.findOne({email: req.body.email}, function (err, myDocument) {
        var user = myDocument;
        if (!user || err || user == null) {
          res.json("Password Reset Email Sent to " + req.body.email);
          return;
        }
        var token = jwt.sign({'sub': user._id}, config.secret, {
          expiresIn:  30 * 60
        });
        console.log("http://localhost:9000/password/" + token);
        res.json("Password Reset Email Sent to " + req.body.email);
      });
    },
   
  }

}());

