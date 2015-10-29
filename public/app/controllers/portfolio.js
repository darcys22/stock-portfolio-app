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


  $scope.portfolio = {};
  $scope.loading = true;
  //$scope.portfolio = StockFactory.getPortfolio().then(
    //function (response) {
      //$scope.loading = false;
      //$scope.portfolio = response.data;
    //}, function (status) {
      //$alert({
        //content: status,
        //animation: 'fadeZoomFadeDown',
        //type: 'material',
        //duration: 3
      //})
    //}
  //);
 
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
  
  $scope.submit = function() {
    console.log("yaya")
    if (!$scope.buy.bDate) {
      $scope.buy.bDate = new Date;
    }
    $scope.buyResponse = StockFactory.buy({name: $scope.buy.name, qty: $scope.buy.qty, bPrice: $scope.buy.bPrice, bDate: $scope.buy.bDate})
    for (var attrname in $scope.searchStock) {$scope.buy[attrname] = $scope.searchStock[attrname];}
    $scope.portfolio.owned.unshift($scope.buy);
    $scope.buy = {};
  };

  var stockModal = $modal({scope: $scope, template: 'partials/modal.html', show: false});

  $scope.sell = function(stock) {
    $scope.sellStock = stock;
    stockModal.$promise.then(stockModal.show);
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
  


  //Dummy Data because ajax was being annoying
  $scope.portfolio = {"owned":[{"_id":"56296c3410de11cefb90f5d2","qty":39,"name":"tif","bPrice":3281.94,"bDate":"2014-01-23"},{"_id":"56296c34ea15eaf10f92df3a","qty":26,"name":"Edwards","bPrice":1206.22,"bDate":"2014-12-03"},{"_id":"56296c34026714f38dafa1af","qty":22,"name":"rgdx","bPrice":2540.44,"bDate":"2014-08-30"},{"_id":"56296c348d2ce898d47cfc49","qty":34,"name":"figy","bPrice":3868.52,"bDate":"2014-06-22"},{"_id":"56296c342b4a8c4e52dff602","qty":26,"name":"1388.hk","bPrice":3828.78,"bDate":"2014-02-13"},{"_id":"56296c34793e84cae7c1a195","qty":27,"name":"apb","bPrice":3110.16,"bDate":"2014-03-26"}],"history":[{"_id":"56296c34c28a3abd315aca78","qty":22,"name":"APC","bPrice":2911.55,"bDate":"2015-10-20","sPrice":1483.17,"sDate":"2015-02-27"},{"_id":"56296c34aaa4faee3df9c2b7","qty":38,"name":"tik","bPrice":2481.64,"bDate":"2014-01-03","sPrice":2303.64,"sDate":"2014-12-18"},{"_id":"56296c34f139ec319f9a57a8","qty":25,"name":"ism.to","bPrice":1852.6,"bDate":"2015-02-22","sPrice":1250.81,"sDate":"2015-02-05"},{"_id":"56296c344965579628ee1077","qty":27,"name":"wvr.v","bPrice":2568.19,"bDate":"2014-03-16","sPrice":2517.54,"sDate":"2015-10-20"},{"_id":"56296c34336f66d11abdb16b","qty":21,"name":"qan.ax","bPrice":3899.37,"bDate":"2014-06-03","sPrice":3328.64,"sDate":"2014-01-20"},{"_id":"56296c340edb4fca4de38166","qty":20,"name":"goog","bPrice":1283.67,"bDate":"2014-06-12","sPrice":1376.21,"sDate":"2015-04-18"}]}

  //Yahoo query builder
  var qts = $scope.portfolio.owned.map(function(x) { return x.name;}).join(', ');
  $scope.ownedStock = StockFactory.getYQL( yqlBuilder('"' + qts + '"'));
  $scope.ownedStock.then(function (stock) {
    arrayObjMerger($scope.portfolio.owned, stock.query.results.quote) 
  })

}]);

})();
