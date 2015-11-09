var User = require('./models/user')
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var configDB = require('../config/database.js');

var stocks = require('./controllers/stocks.js');

module.exports = function(app, passport) {

// normal routes ===============================================================
    
    app.get('/api/portfolio', passport.authenticate('jwt', { session: false }), stocks.getPortfolio);
    app.get('/api/history', passport.authenticate('jwt', { session: false }), stocks.getHistory);
    app.post('/api/buy', passport.authenticate('jwt', { session: false }), stocks.buy);
    app.post('/api/sell', passport.authenticate('jwt', { session: false }), stocks.sell);

    app.get('/api/user', passport.authenticate('jwt', { session: false }), function(req, res) {
      res.json({name: req.user.name, email: req.user.email});
    });


// =============================================================================
// AUTHENTICATE ================================================================
// =============================================================================

// locally --------------------------------
    // LOGIN ===============================
    // process the login form
    app.post('/api/signIn', function(req, res, next) {
      passport.authenticate('local-login', {session : false}, function(err, user, info) { 
        if(err) { return next(err) }
        if (!user) {
          res.json({ success: false, message: 'Authentication failed.' }); 
        }

        var token = jwt.sign({'sub': user._id}, configDB.secret, {
          expiresIn: 1440 * 60
        });

        res.json({token: token});
      })(req, res, next);
    });

    // SIGNUP =================================
    // process the signup form
    app.post('/api/signUp', passport.authenticate('local-signup', { session : false}), function (req, res) {
      var token = jwt.sign({'sub': user._id}, configDB.secret, {
        expiresIn: 1440 * 60
      });
      console.log("/password/" + token);
      res.json("Confirmation Email Sent");
    });

    app.post('/api/forgot', function(req, res) {
      var user = User.findOne({email: req.body.email}) 
      if (!user) {
        res.json({ success: false, message: 'Authentication failed.' }); 
      }
      var token = jwt.sign({'sub': user._id}, configDB.secret, {
        expiresIn:  30 * 60
      });
      console.log("/password/" + token);
      res.json("Paassword Reset Email Sent");
    });

    app.post('/api/password', passport.authenticate('jwt', { session: false }), function(req, res) {
      //If there is a token and no password on account make password new password
      //if the old pass matches the password make new pass 
      //auth token {auth_token: x}
      if(req.body.auth_token) console.log('token');
      console.log("Authenticated password");
      res.json({password: req.body.password});
    });


// =============================================================================
// Front End Routes ============================================================
// =============================================================================
    // show the home page (will also have our login links)
    app.get('*', function(req, res) {
        res.sendfile('./dist/index.html');
    });



};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
