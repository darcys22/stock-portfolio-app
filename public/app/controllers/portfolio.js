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

.controller('PortfolioController', ['$scope', '$http', 'TFNDFactory', 'StockFactory', '$alert', function($scope, $http, TFNDFactory, StockFactory, $alert) {

  $scope.portfolio = {};
  $scope.loading = true;
  $scope.portfolio = StockFactory.get().then(
    function (response) {
      $scope.loading = false;
      $scope.portfolio = response.data;
    }, function (status) {
      $alert({
        content: status,
        animation: 'fadeZoomFadeDown',
        type: 'material',
        duration: 3
      })
    }
  )

}]);

})();

