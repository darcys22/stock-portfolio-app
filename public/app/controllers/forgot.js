(function () {
  'use strict';

angular.module('myApp.password', ['ngRoute'])

// Declared route
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/forgot', {
    templateUrl: 'partials/forgot.html',
    controller: 'forgotController'
  });
}])

.controller('forgotController', ['$scope', '$routeParams', '$alert', 'StockFactory', function($scope, $routeParams, $alert, StockFactory) {


  $scope.submit = function() {
    if ($scope.email) {
      StockFactory.password({password: $scope.email})
    } else {
       $alert({content: 'Please enter an email address', duration: 3, animation:"am-fade-and-slide-top", placement: 'top-right', type: 'danger', show: true});
    }
  };


}]);

})();

