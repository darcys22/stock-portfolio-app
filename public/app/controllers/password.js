(function () {
  'use strict';

angular.module('myApp.password', ['ngRoute'])

// Declared route
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/password/:passwordToken', {
    templateUrl: 'partials/password.html',
    controller: 'PasswordController'
  });
}])

.controller('PasswordController', ['$scope', '$auth', '$location', '$routeParams', '$alert', 'StockFactory', function($scope, $auth, $location, $routeParams, $alert, StockFactory) {

  $scope.token = $routeParams.passwordToken;

  $scope.submit = function() {
    if ($scope.password == $scope.passwordConfirm) {
      StockFactory.password({auth_token: $scope.token, password: $scope.password})
      .then(function(data) {
      $alert({
        content: 'Password Set!',
        animation:"am-fade-and-slide-top",
        type: 'material',
        duration: 7
      });
      $auth.setToken(data.token);
      $location.path('/portfolio');
      $scope.$apply();
    }).catch(function(response) {
      $alert({
        content: response.data.message,
        animation:"am-fade-and-slide-top",
        type: 'material',
        duration: 3
      });
    });

    } else {
       $alert({content: 'Password does not match confirmation', duration: 3, animation:"am-fade-and-slide-top", placement: 'top-right', type: 'danger', show: true});
    }
  };


}]);

})();

