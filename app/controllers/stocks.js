(function () {

  var User = require('./../models/user.js');

  function portfolioTrimmer(portfolio) {
    var uniques = [];
    var index, sum;
      console.log("--------2");
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
          console.log("--------3");
    return uniques;          
  }

  module.exports = {

    getPortfolio: function(req, res) {
      console.log("--------1");
      res.json( portfolioTrimmer(req.user.portfolio));
    },
    
    getHistory: function(req, res) {
      res.json(req.user.history);
    },

    buy: function(req, res) {
      req.user.portfolio.push(req.body)
      req.user.save(function (err, savedPreference) {
        if (err) 
          return res.send(500, {error: err});
          return res.send("successfully saved")
      })
    },
   
    sell: function(req, res) {
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

