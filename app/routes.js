var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var configDB = require('../config/database.js');

var stocks = require('./controllers/stocks.js');
var users = require('./controllers/users.js');

module.exports = function(app, passport) {

// normal routes ===============================================================
    
    app.get('/api/portfolio', passport.authenticate('jwt', { session: false }), stocks.getPortfolio);
    app.delete('/api/portfolio/:id', passport.authenticate('jwt', { session: false }), stocks.deletePortfolio);
    app.get('/api/history', passport.authenticate('jwt', { session: false }), stocks.getHistory);
    app.delete('/api/history/:id', passport.authenticate('jwt', { session: false }), stocks.deleteHistory);
    app.post('/api/buy', passport.authenticate('jwt', { session: false }), stocks.buy);
    app.post('/api/sell', passport.authenticate('jwt', { session: false }), stocks.sell);

    app.get('/api/user', passport.authenticate('jwt', { session: false }), users.getUser);
    app.post('/api/user', passport.authenticate('jwt', { session: false }), users.changeUser);


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
      var token = jwt.sign({'sub': req.user._id}, configDB.secret, {
        expiresIn: 1440 * 60
      });
      console.log("http://localhost:9000/password/" + token);
      res.json("Confirmation Email Sent");
    });

    // Password Recovery =================================
    // process the password changes
    app.post('/api/forgot', users.forgot);
    app.post('/api/password', passport.authenticate('jwt', { session: false }), users.changePass);


// =============================================================================
// Front End Routes ============================================================
// =============================================================================
    // show the home page (will also have our login links)
    app.get('*', function(req, res) {
        res.sendfile('./dist/index.html');
    });



};

