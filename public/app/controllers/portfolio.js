(function () {
  'use strict';

var yqlBuilder = function (quotes) {
  console.log(quotes);
  var query = "select * from yahoo.finance.quotes where symbol in (" + quotes + ")";
  console.log(query);
  var yql = "http://query.yahooapis.com/v1/public/yql?q=" + escape(query) + "&format=json&env=http://datatables.org/alltables.env";
};

angular.module('myApp.portfolio', ['ngRoute'])

// Declared route
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/portfolio', {
    templateUrl: 'partials/portfolio.html',
    controller: 'PortfolioController'
  });
}])

.controller('PortfolioController', ['$scope', '$http','$modal' ,'TFNDFactory', 'StockFactory', '$alert', '$timeout', function($scope, $http, $modal, TFNDFactory, StockFactory, $alert, $timeout) {


  $scope.portfolio = {};
  $scope.loading = true;
  //$scope.portfolio = StockFactory.get().then(
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
  $scope.searchChanged = function (searchQuery) {
    if(_timeout){ //if there is already a timeout in process cancel it
      $timeout.cancel(_timeout);
    }
    if (searchQuery) {
      _timeout = $timeout(function(){
        console.log("bark bark");
        //findBooks(searchQuery);
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
      $alert({
        content: $scope.buy.bDate + $scope.buy.bPrice + $scope.buy.count + $scope.buy.name,
        animation: 'fadeZoomFadeDown',
        type: 'material',
        duration: 3
      });
      $scope.portfolio.owned.unshift($scope.buy);
  };

  var stockModal = $modal({scope: $scope, template: 'partials/modal.html', show: false});

  $scope.sell = function(stock) {
    $scope.sellStock = stock;
    stockModal.$promise.then(stockModal.show);
  };




  //Dummy Data because ajax was being annoying
  $scope.portfolio = {"owned":[{"_id":"56296c3410de11cefb90f5d2","qty":39,"name":"Malone","bPrice":3281.94,"bDate":"2014-01-23"},{"_id":"56296c34ea15eaf10f92df3a","qty":26,"name":"Edwards","bPrice":1206.22,"bDate":"2014-12-03"},{"_id":"56296c34026714f38dafa1af","qty":22,"name":"Bowman","bPrice":2540.44,"bDate":"2014-08-30"},{"_id":"56296c348d2ce898d47cfc49","qty":34,"name":"Walls","bPrice":3868.52,"bDate":"2014-06-22"},{"_id":"56296c342b4a8c4e52dff602","qty":26,"name":"Rich","bPrice":3828.78,"bDate":"2014-02-13"},{"_id":"56296c34793e84cae7c1a195","qty":27,"name":"Mcintosh","bPrice":3110.16,"bDate":"2014-03-26"}],"history":[{"_id":"56296c34c28a3abd315aca78","qty":22,"name":"Helga","bPrice":2911.55,"bDate":"2015-10-20","sPrice":1483.17,"sDate":"2015-02-27"},{"_id":"56296c34aaa4faee3df9c2b7","qty":38,"name":"Crane","bPrice":2481.64,"bDate":"2014-01-03","sPrice":2303.64,"sDate":"2014-12-18"},{"_id":"56296c34f139ec319f9a57a8","qty":25,"name":"Beverley","bPrice":1852.6,"bDate":"2015-02-22","sPrice":1250.81,"sDate":"2015-02-05"},{"_id":"56296c344965579628ee1077","qty":27,"name":"Crosby","bPrice":2568.19,"bDate":"2014-03-16","sPrice":2517.54,"sDate":"2015-10-20"},{"_id":"56296c34336f66d11abdb16b","qty":21,"name":"Ratliff","bPrice":3899.37,"bDate":"2014-06-03","sPrice":3328.64,"sDate":"2014-01-20"},{"_id":"56296c340edb4fca4de38166","qty":20,"name":"Angelique","bPrice":1283.67,"bDate":"2014-06-12","sPrice":1376.21,"sDate":"2015-04-18"}]}

  //Yahoo query builder
  var qts = $scope.portfolio.owned.map(function(x) { return '"' + x.name + '"'; }).join(', ');
  yqlBuilder(qts);

}]);

})();

