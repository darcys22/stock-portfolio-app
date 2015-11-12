(function () {
  'use strict';

angular.module('myApp.signup', ['ngRoute'])

// Declared route
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/signup', {
    templateUrl: 'partials/signup.html',
    controller: 'SignupController'
  });
}])

.controller('SignupController', ['$scope', '$alert', '$auth', function($scope, $alert, $auth) {

  $scope.submit = function() {
    $auth.signup({
      email: $scope.email,
      name: $scope.name
    }).then(function() {
      $alert({
        content: 'Thank You for signing up! A Confirmation email has been sent to ' + $scope.email + ', please follow the instructions contained in the email to complete registration',
        animation:"am-fade-and-slide-top",
        type: 'material',
        duration: 7
      });
      $scope.email = "";
      $scope.name = "";
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

