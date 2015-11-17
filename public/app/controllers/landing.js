(function () {
  'use strict';

angular.module('myApp.landing', ['ngRoute'])

// Declared route
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'partials/landing.html',
    controller: 'LandingController'
  });
}])

.controller('LandingController', ['$scope', '$http', function($scope, $http) {
  //TODO Make the landing submition signup
  $scope.test = 'test';

}]);

})();

