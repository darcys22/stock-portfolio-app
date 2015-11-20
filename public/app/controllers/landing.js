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

.controller('LandingController', ['$scope', '$http', '$auth', '$alert', function($scope, $http, $auth, $alert) {
  $scope.submitEmail = function() {
    $auth.signup({
      email: $scope.email,
      name: ""
    }).then(function() {
      $alert({
        content: 'Thank You for signing up! A Confirmation email has been sent to ' + $scope.email + ', please follow the instructions contained in the email to complete registration',
        animation:"am-fade-and-slide-top",
        type: 'material',
        duration: 7
      });
      $scope.email = "";
    }).catch(function(response) {
      $alert({
        content: response.data.message,
        animation:"am-fade-and-slide-top",
        type: 'material',
        duration: 3
      });
    });
  };
}]);

})();

