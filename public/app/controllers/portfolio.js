(function () {
  'use strict';

var yqlBuilder = function (quotes) {
  var query = "select * from yahoo.finance.quotes where symbol in (" + quotes + ")";
  return "https://query.yahooapis.com/v1/public/yql?q=" + escape(query) + "&format=json&env=http://datatables.org/alltables.env";
};

var arrayObjMerger = function (arr1, arr2) {
  if (arr2.constructor != Array) arr2 = [arr2]
  for(var i in arr1){
    for (var j in arr2)
      if (arr2[j].symbol == arr1[i].name) {
        for (var attrname in arr2[j]) {arr1[i][attrname] = arr2[j][attrname];}
      }
  }
};

angular.module('myApp.portfolio', ['ngRoute'])

// Declared route
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/portfolio', {
    templateUrl: 'partials/portfolio.html',
    controller: 'PortfolioController'
  });
}])

.controller('PortfolioController', ['$scope', '$http','$modal' , 'StockFactory', '$alert', '$timeout', function($scope, $http, $modal, StockFactory, $alert, $timeout) {


  $scope.portfolio = [];
  $scope.history = [];
  $scope.loading = true;

  //Get Users Portfolio
  $scope.portfolio = StockFactory.getPortfolio().then(
    function (response) {
      $scope.portfolio = response;
      if (typeof $scope.portfolio !== 'undefined' && $scope.portfolio.length > 0) {
        $scope.portfolioBuilder();
      } else {
        $scope.portfolioEmpty = true;
        $scope.loading = false;
      }


    //Error handling on get portfolio
    }, function (status) {
      $alert({
        content: status,
        animation:"am-fade-and-slide-top",
        type: 'material',
        duration: 3
      })
    }
  );

 
  // Searching for a stock
  var _timeout; 
  $scope.invalidStock = true
  $scope.searchStock = {}
  $scope.searchChanged = function (searchQuery) {
    $scope.invalidStock = true
    if(_timeout){ //if there is already a timeout in process cancel it
      $timeout.cancel(_timeout);
    }
    if (searchQuery) {
      _timeout = $timeout(function(){
        $scope.searchStock = StockFactory.getYQL( yqlBuilder('"' + searchQuery + '"'));
        $scope.searchStock.then(function (stock) {
          $scope.searchStock = stock.query.results.quote;
          if ($scope.searchStock.Name === null) { $scope.searchStock = {}
          } else { $scope.invalidStock = false; }
        })
        _timeout = null;
      },800);
    }
  };

  //Yahoo query builder
  $scope.portfolioBuilder = function() {
    var qts = $scope.portfolio.map(function(x) { return x.name;}).join(', ');
    $scope.ownedStock = StockFactory.getYQL( yqlBuilder('"' + qts + '"'));
    $scope.ownedStock.then(function (stock) {
      arrayObjMerger($scope.portfolio, stock.query.results.quote) 
      for (var i=0; i < $scope.portfolio.length; i++) {
        $scope.portfolio[i].individualProfit = +$scope.portfolio[i].LastTradePriceOnly-$scope.portfolio[i].bPrice;
        $scope.portfolio[i].itemTotal = +$scope.portfolio[i].individualProfit * $scope.portfolio[i].qty;
        $scope.ownedProfitAdd($scope.portfolio[i].itemTotal);
      }
      $scope.loading = false;
    })
  };
  
  //Buy a stock with the buy form
  $scope.submit = function() {
    if (!$scope.buy.bDate) {
      $scope.buy.bDate = new Date;
    }
    $scope.buyResponse = StockFactory.buy({name: $scope.buy.name, qty: $scope.buy.qty, bPrice: $scope.buy.bPrice, bDate: $scope.buy.bDate})
    for (var attrname in $scope.searchStock) {$scope.buy[attrname] = $scope.searchStock[attrname];}
    $scope.buy.individualProfit = +$scope.buy.LastTradePriceOnly-$scope.buy.bPrice;
    $scope.buy.itemTotal = +$scope.buy.individualProfit * $scope.buy.qty;
    $scope.ownedProfitAdd($scope.buy.itemTotal);
    $scope.portfolioEmpty = false;
    $scope.portfolio.unshift($scope.buy);
    $scope.buy = {};
    $scope.invalidStock = true
    $scope.searchStock = {}
  };

  //Modal Popup to sell stock
  var stockModal = $modal({scope: $scope, templateUrl: 'partials/modal.html', show: false});

  $scope.sell = function(stock) {
    $scope.sellStock = stock;
    stockModal.$promise.then(stockModal.show);
  };

  // Sell a stock with the sell form
  $scope.submitSell = function() {
    if (!$scope.sellStock.sDate) {
      $scope.sellStock.sDate = new Date;
    }
    if (!$scope.sellStock.sellQty) {
      $scope.sellStock.sellQty = $scope.sellStock.qty;
    }
    $scope.sellResponse = StockFactory.sell({name: $scope.sellStock.name, sellQty: $scope.sellStock.sellQty, sPrice: $scope.sellStock.sPrice, sDate: $scope.sellStock.sDate})
    $scope.sellStock = {};
    stockModal.hide();
    $scope.sellResponse.then(
      function (response) {
        $scope.loading = true;
        $scope.portfolio = response.portfolio;
        if (typeof $scope.portfolio !== 'undefined' && $scope.portfolio.length > 0) {
          $scope.portfolioBuilder();
        } else {
          $scope.portfolioEmpty = true;
          $scope.loading = false;
        }
        $scope.history = response.history;
      //Error handling on get history
      }, function (status) {
        $alert({
          content: status,
          animation:"am-fade-and-slide-top",
          type: 'material',
          duration: 3
        })
      }
    )
  };

  $scope.deletePortfolio = function(id) {
    console.log(id)
    $scope.sellResponse = StockFactory.deletePortfolio(id)
    stockModal.hide();
    $scope.sellResponse.then(
      function (response) {
        $scope.loading = true;
        $scope.portfolio = response.portfolio;
        if (typeof $scope.portfolio !== 'undefined' && $scope.portfolio.length > 0) {
          $scope.portfolioBuilder();
        } else {
          $scope.portfolioEmpty = true;
          $scope.loading = false;
        }
      //Error handling on get history
      }, function (status) {
        $alert({
          content: status,
          animation:"am-fade-and-slide-top",
          type: 'material',
          duration: 3
        })
      }
    )
  };
  $scope.deleteHistory = function(id) {
    console.log(id)
    $scope.sellResponse = StockFactory.deleteHistory(id)
    stockModal.hide();
    $scope.sellResponse.then(
      function (response) {
        $scope.history = response.history;
      //Error handling on get history
      }, function (status) {
        $alert({
          content: status,
          animation:"am-fade-and-slide-top",
          type: 'material',
          duration: 3
        })
      }
    )
  };
  // History Show
  $scope.historyActive = false;
  $scope.historyLoad = false;
  $scope.historySearch = false;
  $scope.historyHover = function() {
    if (!$scope.historySearch) {
      $scope.getHistory();
      $scope.historySearch = true;
    }
  }  
  $scope.historyButton = function() {
    $scope.historyActive = !$scope.historyActive;
    if ($scope.historyActive && !$scope.historySearch) $scope.historyHover();
  }  
  // Gets User History
  $scope.getHistory = function() {
    $scope.historyLoad = true;
    $scope.history = StockFactory.getHistory().then(
      function (response) {
        $scope.historyLoad = false;
        $scope.history = response;
      //Error handling on get history
      }, function (status) {
        $scope.historyLoad = false;
        $alert({
          content: status,
          animation:"am-fade-and-slide-top",
          type: 'material',
          duration: 3
        })
      }
    );
  };

  // Profit Calculations
  $scope.ownedProfit = 0;
  $scope.soldProfit = 0;
  $scope.ownedProfitAdd = function(x) {
    $scope.ownedProfit += x;
  };
  $scope.soldProfitAdd = function(x) {
    $scope.soldProfit += x;
  };
  
}]);

})();
