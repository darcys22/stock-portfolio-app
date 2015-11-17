(function () {

  var User = require('./../models/user.js');
  var util = require('util');

  function portfolioTrimmer(portfolio) {
    var uniques = [];
    var index, sum;
    for (var i=0; i < portfolio.length; i++) {
      index = uniques.map(function(e) { return e.name; }).indexOf(portfolio[i].name); 
      if (index == -1) {
        uniques.push(portfolio[i])
      } else {
        sum = uniques[index].bPrice * uniques[index].qty + portfolio[i].bPrice * portfolio[i].qty;
        uniques[index].qty = Number(uniques[index].qty) + Number(portfolio[i].qty);
        uniques[index].bPrice = sum / uniques[index].qty;
        if (portfolio[i].bDate < uniques[index].bDate) uniques[index].bDate = portfolio[i].bDate;
      }
    }
    return uniques;          
  }

  module.exports = {

    getPortfolio: function(req, res) {
      res.json( portfolioTrimmer(req.user.portfolio));
    },
    
    getHistory: function(req, res) {
      res.json(req.user.history);
    },

    deletePortfolio: function(req, res) {
      req.checkParams('id', 'Invalid ID').notEmpty().isMongoId();
      var errors = req.validationErrors();
      if (errors) {
        res.send('There have been validation errors: ' + util.inspect(errors), 400);
        return;
      }
      req.user.portfolio.pull(req.params.id)
      req.user.save(function (err, savedPreference) {
        if (err) 
          return res.send(500, {error: err});
          return res.send({portfolio: portfolioTrimmer(savedPreference.portfolio)})
      })
    },
    deleteHistory: function(req, res) {
      req.checkParams('id', 'Invalid ID').notEmpty().isMongoId();
      var errors = req.validationErrors();
      if (errors) {
        res.send('There have been validation errors: ' + util.inspect(errors), 400);
        return;
      }
      req.user.history.pull(req.params.id)
      req.user.save(function (err, savedPreference) {
        if (err) 
          return res.send(500, {error: err});
          return res.send({history: savedPreference.history})
      })
    },

    buy: function(req, res) {
      req.checkBody('name', 'Invalid name').notEmpty().isAlpha();
      req.checkBody('qty', 'Invalid qty').notEmpty().isInt({min: 1});
      req.checkBody('bPrice', 'Invalid price').notEmpty().isCurrency({allow_negatives: false});
      req.checkBody('bDate', 'Invalid date').notEmpty().isDate();
      var errors = req.validationErrors();
      if (errors) {
        res.send('There have been validation errors: ' + util.inspect(errors), 400);
        return;
      }
      req.user.portfolio.push( {name: req.body.name, qty: req.body.qty, bPrice: req.body.bPrice, bDate: req.body.bDate})
      req.user.save(function (err, savedPreference) {
        if (err) 
          return res.send(500, {error: err});
          return res.send("successfully saved")
      })
    },
   
    sell: function(req, res) {
      req.checkBody('name', 'Invalid name').notEmpty().isAlpha();
      req.checkBody('sellQty', 'Invalid qty').notEmpty().isInt({min: 1});
      req.checkBody('sPrice', 'Invalid price').notEmpty().isCurrency({allow_negatives: false});
      req.checkBody('sDate', 'Invalid date').notEmpty().isDate();
      var errors = req.validationErrors();
      if (errors) {
        res.send('There have been validation errors: ' + util.inspect(errors), 400);
        return;
      }
      var sellAmt = req.body.sellQty;
      var stock = req.user.portfolio
        .filter(function(e) { return e.name == req.body.name; })
        .sort(function(a,b){ return new Date(a.bDate) - new Date(b.bDate) }); 
      stockLoop:
        for (var i = 0; sellAmt > 0; i++) {
          if (i >= stock.length) break stockLoop;
          var iterationQty = stock[i].qty
          if (stock[i].qty > sellAmt) {
            var edit = req.user.portfolio.id(stock[i]._id)
            req.user.portfolio.pull(edit)
            edit.qty -= sellAmt;
            req.user.portfolio.push(edit)
            iterationQty = sellAmt
          } else {
            req.user.portfolio.pull(stock[i]);
          }
          req.user.history.push( {
            name: stock[i].name, 
            qty: iterationQty, 
            bDate: stock[i].bDate, 
            bPrice: stock[i].bPrice, 
            sDate: req.body.sDate, 
            sPrice: req.body.sPrice
          });
          sellAmt -= stock[i].qty;
        }
      req.user.save(function (err, savedPreference) {
        if (err) 
          return res.send(500, {error: err});
          return res.send({portfolio: portfolioTrimmer(savedPreference.portfolio), history: savedPreference.history})
      })
    }
  }

}());

