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
      companyName: $scope.name,
      businessNumber: $scope.abn,
      email: $scope.email,
      password: $scope.password
    }).then(function() {
      $alert({
        content: 'You have successfully signed up',
        animation: 'fadeZoomFadeDown',
        type: 'material',
        duration: 3
      });
    }).catch(function(response) {
      $alert({
        content: response.data.message,
        animation: 'fadeZoomFadeDown',
        type: 'material',
        duration: 3
      });
    });
  };


}]);

})();

