(function () {

  var User = require('./../models/user.js');

  module.exports = {

    getPortfolio: function(req, res) {
      var uniques = [];
      var portfolio = req.user.portfolio;
      var index, sum;
      for (var i=0; i < portfolio.length; i++) {
        index = uniques.map(function(e) { return e.name; }).indexOf(portfolio[i].name); 
        if (index == -1) {
          uniques.push(portfolio[i])
        } else {
          sum = uniques[index].bPrice * uniques[index].qty + portfolio[i].bPrice * portfolio[i].qty;
          console.log(index)
          console.log( uniques[index].bPrice)
          console.log( uniques[index].qty)
          console.log( portfolio[i].bPrice)
          console.log( portfolio[i].qty)
          console.log("-----")
          console.log(sum)
          console.log( Number(uniques[index].qty) + Number(portfolio[i].qty))
          console.log("-----")
          uniques[index].qty = Number(uniques[index].qty) + Number(portfolio[i].qty);
          uniques[index].bPrice = sum / uniques[index].qty;
          if (portfolio[i].bDate < uniques[index].bDate) uniques[index].bDate = portfolio[i].bDate;
        }
      }
      res.json(uniques);
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

