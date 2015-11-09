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

.controller('PasswordController', ['$scope', '$routeParams', '$alert', 'StockFactory', function($scope, $routeParams, $alert, StockFactory) {

  $scope.token = $routeParams.passwordToken

  $scope.submit = function() {
    if ($scope.password == $scope.passwordConfirm) {
      StockFactory.password({auth_token: $scope.token, password: $scope.password})
    } else {
       $alert({content: 'Password does not match confirmation', duration: 3, animation:"am-fade-and-slide-top", placement: 'top-right', type: 'danger', show: true});
    }
  };


}]);

})();

