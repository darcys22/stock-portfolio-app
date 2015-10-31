(function () {

  var User = require('./../models/user.js');

  module.exports = {

    get: function(req, res) {
      res.sendfile('./app/controllers/portfolio.json');
    },
    
    getHistory: function(req, res) {
      res.sendfile('./app/controllers/portfolio.json');
    },

    buy: function(req, res) {
      req.user.portfolio.push(req.body)
      console.log(req.user);
      req.user.save(function (err, savedPreference) {
        if (err) 
          return res.send(500, {error: err});
          return res.send("successfully saved")
      })
      //User.findOneAndUpdate({_id: req.user._id}, req.user, {upsert: true},
                 //function(err, doc){
                   //console.log(err)
                   //if (err) res.send(500, {error: err});
                   //return res.send("successfully saved")
                 //})
    },
   
    sell: function(req, res) {
      console.log(req.body);
      res.json({lel: 'SALD'});
    }

    //topBooks: function(req, res) {
      //Book
      //.find({rank : {$gt : 0}})
      //.sort('rank')
      //.limit(100)
      //.exec(function(err, books) {
        //res.send(books);
      //});
    //},

    //searchBooks: function(req, res) {
      //var Search = require('./Search.js');
      //Search(req.body, function(error, data) {
        //if (error) {
          //console.debug('Search: ' + err);
          //res.status(400).send(error);
        //} else {
          //res.json(JSON.stringify(data));
        //};
      //});
    //}
  }

}());

