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

.controller('PortfolioController', ['$scope', '$http', 'TFNDFactory', '$alert', function($scope, $http, TFNDFactory, $alert) {

  $scope.submit = function() {
    TFNDFactory.post({"tfn" : "nothing"})
      .then(function(data) {
        $alert({
          content: JSON.stringify(data.data),
          animation: 'fadeZoomFadeDown',
          type: 'material',
          duration: 3
        })
      })
    };

}]);

})();

