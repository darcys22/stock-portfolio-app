(function () {
  'use strict';

angular.module('myApp.portfolio', ['ngRoute'])

// Declared route
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/portfolio', {
    templateUrl: 'partials/portfolio.html',
    controller: 'PortfolioController'
  });
}])

.controller('PortfolioController', ['$scope', '$http','$modal' ,'TFNDFactory', 'StockFactory', '$alert', function($scope, $http, $modal, TFNDFactory, StockFactory, $alert) {

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
    stockModal.$promise.then(stockModal.show);
  };



  //Dummy Data because ajax was being annoying
  $scope.portfolio = {"owned": [{"bPrice": "$3,032.86", "_id": "56249e160c173c6f3c76af5d", "bDate": "2015-07-20", "name": "Norman", "qty": 21}, {"bPrice": "$3,963.42", "_id": "56249e16b389e1d5dc1d584d", "bDate": "2015-04-30", "name": "June", "qty": 22}, {"bPrice": "$2,705.40", "_id": "56249e16e198585e56b2b105", "bDate": "2015-03-08", "name": "Bettye", "qty": 39}, {"bPrice": "$1,005.60", "_id": "56249e16a9154240fb6c6249", "bDate": "2015-03-25", "name": "Brittney", "qty": 25}, {"bPrice": "$3,311.31", "_id": "56249e16fd02f5a341642b19", "bDate": "2014-10-11", "name": "Patrice", "qty": 28}, {"bPrice": "$3,628.94", "_id": "56249e1668450e343a5da120", "bDate": "2015-01-17", "name": "Natasha", "qty": 37}, {"bPrice": "$3,087.25", "_id": "56249e16876f41e982390448", "bDate": "2014-07-06", "name": "Louella", "qty": 22}], "history": [{"sDate": "2014-11-12", "_id": "56249e162d5c72e368b96817", "name": "Dixon", "qty": 40, "bDate": "2014-03-01", "bPrice": "$2,753.89", "sPrice": "$3,134.58"}, {"sDate": "2015-02-18", "_id": "56249e16569b0381672ccf45", "name": "Marietta", "qty": 26, "bDate": "2014-07-09", "bPrice": "$2,448.41", "sPrice": "$3,687.49"}, {"sDate": "2015-10-08", "_id": "56249e1660fde15455cc246e", "name": "Cross", "qty": 37, "bDate": "2015-01-17", "bPrice": "$2,866.53", "sPrice": "$1,692.97"}, {"sDate": "2015-05-17", "_id": "56249e16d97a472967266355", "name": "Emma", "qty": 20, "bDate": "2014-08-01", "bPrice": "$1,412.09", "sPrice": "$1,132.89"}, {"sDate": "2014-05-26", "_id": "56249e16d8151ef62c5a8f45", "name": "Katina", "qty": 25, "bDate": "2015-01-27", "bPrice": "$1,054.93", "sPrice": "$3,063.43"}, {"sDate": "2015-05-24", "_id": "56249e160952117de0d53209", "name": "Gale", "qty": 24, "bDate": "2014-05-18", "bPrice": "$1,174.96", "sPrice": "$1,792.53"}]}

}]);

})();

