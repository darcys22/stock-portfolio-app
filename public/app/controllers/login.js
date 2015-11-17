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

    $scope.submit = function() {
      $auth.login({ email: $scope.email, password: $scope.password })
        .then(function() {
          $location.path('/settings');
          $alert({
            content: 'You have successfully signed in',
            animation:"am-fade-and-slide-top",
            type: 'material',
            duration: 3
          });
        })
        .catch(function(response) {
          console.log(response);
          $alert({
            content: response.data,
            animation:"am-fade-and-slide-top",
            type: 'material',
            duration: 3
          });
        });
    };

}]);

})();

