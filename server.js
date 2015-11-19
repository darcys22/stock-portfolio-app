// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 9000;
var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var expressValidator = require('express-validator');

var jwt = require('jsonwebtoken');

var config = require('./config/config.js');
var notifier = require('node-notifier');


var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Origin', 'query.yahooapis.com');
    res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE');
    next();
}

// configuration ===============================================================
var options = { server: { auto_reconnect: true, socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } },
                db:     { numberOfRetries: 10, retryMiliSeconds: 1000 }
};
mongoose.set('debug', true)
mongoose.connect(uriUtil.formatMongoose(config.db.url), options); // connect to our database
var conn = mongoose.connection;

conn.on('error', function(error) {
    console.error('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
  });
conn.on('disconnected', function() {
    console.log('disconnected');
    mongoose.connect(uriUtil.formatMongoose(config.db.url), options); // connect to our database
  });

conn.once('open', function() {

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(express.static(__dirname + '/dist'));
app.use(morgan('dev', {immediate: true})); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator()); // this line must be immediately after express.bodyParser()!
app.use(allowCrossDomain);


// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
notifier.notify({ title: "WebServer:", message : "server running" });

});
