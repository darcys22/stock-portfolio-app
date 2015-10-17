(function () {
  'use strict';

angular.module('myApp.login', ['ngRoute'])

// Declared route
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'partials/login.html',
    controller: 'LoginController'
  });
}])

.controller('LoginController', ['$scope', '$alert', '$auth', '$location', function($scope, $alert, $auth, $location) {
    $scope.rememberMe = false;

    $scope.submit = function() {
      //$auth.setStorage($scope.rememberMe ? 'localStorage' : 'sessionStorage');
      $auth.login({ email: $scope.email, password: $scope.password, rememberMe: $scope.rememberMe })
        .then(function() {
          $location.path('/settings');
          $alert({
            content: 'You have successfully signed in',
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });
        })
        .catch(function(response) {
          console.log(response);
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

