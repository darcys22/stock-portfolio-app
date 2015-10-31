(function () {
  'use strict';

var yqlBuilder = function (quotes) {
  var query = "select * from yahoo.finance.quotes where symbol in (" + quotes + ")";
  return "http://query.yahooapis.com/v1/public/yql?q=" + escape(query) + "&format=json&env=http://datatables.org/alltables.env";
};

var arrayObjMerger = function (arr1, arr2) {
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

    //Yahoo query builder
      var qts = $scope.portfolio.map(function(x) { return x.name;}).join(', ');
      $scope.ownedStock = StockFactory.getYQL( yqlBuilder('"' + qts + '"'));
      $scope.ownedStock.then(function (stock) {
        arrayObjMerger($scope.portfolio, stock.query.results.quote) 
        for (var i=0; i < $scope.portfolio.length; i++) {
          console.log($scope.portfolio[i].LastTradePriceOnly);
          console.log($scope.portfolio[i].bPrice);
          $scope.portfolio[i].individualProfit = +$scope.portfolio[i].LastTradePriceOnly-$scope.portfolio[i].bPrice;
          $scope.portfolio[i].itemTotal = +$scope.portfolio[i].individualProfit * $scope.portfolio[i].qty;
          $scope.ownedProfitAdd($scope.portfolio[i].itemTotal);
        }
        $scope.loading = false;
      })


    //Error handling on get portfolio
    }, function (status) {
      $alert({
        content: status,
        animation: 'fadeZoomFadeDown',
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
          if ($scope.searchStock.Ask === null) { $scope.searchStock = {}
          } else { $scope.invalidStock = false; }
        })
        _timeout = null;
      },800);
    }
    //} else {
      ////$scope.searching = false;
      ////$scope.searchReturn = false;
      ////$scope.searchResults = false;
    //}
  };
  
  //Buy a stock with the buy form
  $scope.submit = function() {
    console.log("yaya")
    if (!$scope.buy.bDate) {
      $scope.buy.bDate = new Date;
    }
    $scope.buyResponse = StockFactory.buy({name: $scope.buy.name, qty: $scope.buy.qty, bPrice: $scope.buy.bPrice, bDate: $scope.buy.bDate})
    for (var attrname in $scope.searchStock) {$scope.buy[attrname] = $scope.searchStock[attrname];}
    $scope.buy.individualProfit = +$scope.buy.LastTradePriceOnly-$scope.buy.bPrice;
    $scope.buy.itemTotal = +$scope.buy.individualProfit * $scope.buy.qty;
    $scope.ownedProfitAdd($scope.buy.itemTotal);
    $scope.portfolio.unshift($scope.buy);
    $scope.buy = {};
  };

  //Modal Popup to sell stock
  var stockModal = $modal({scope: $scope, template: 'partials/modal.html', show: false});

  $scope.sell = function(stock) {
    $scope.sellStock = stock;
    stockModal.$promise.then(stockModal.show);
  };

  // Sell a stock with the sell form
  $scope.submitSell = function() {
    console.log("yaya")
    if (!$scope.sellStock.sDate) {
      $scope.sellStock.bDate = new Date;
    }
    $scope.sellResponse = StockFactory.sell({name: $scope.sellStock.name, qty: $scope.sellStock.qty, bPrice: $scope.sellStock.bPrice, bDate: $scope.sellStock.bDate, sPrice: $scope.sellStock.sPrice, sDate: $scope.sellStock.sDate})
    $scope.history.unshift($scope.sellStock);
    $scope.sellStock = {};
  };

  // History Show
  $scope.historyActive = false;
  $scope.historyButton = function() {
    $scope.historyActive = !$scope.historyActive;
  }  

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
