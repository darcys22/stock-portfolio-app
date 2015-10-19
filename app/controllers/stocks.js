(function () {

  //var Book = require('./../models/Book.js');

  module.exports = {

    get: function(req, res) {
      res.sendfile('./app/controllers/portfolio.json');
    },

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

