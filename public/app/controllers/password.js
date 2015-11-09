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

.controller('PasswordController', ['$scope', '$routeParams', function($scope, $routeParams) {

  $scope.token = $routeParams.passwordToken

  $scope.submit = function() {
  };


}]);

})();

