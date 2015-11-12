(function () {
  'use strict';

angular.module('myApp.settings', ['ngRoute'])

// Declared route
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/settings', {
    templateUrl: 'partials/profile.html',
    controller: 'SettingsController'
  });
}])

.controller('SettingsController', ['$scope', '$alert', 'StockFactory', function($scope, $alert, StockFactory) {

  $scope.submit = function() {
    if ($scope.password == $scope.passwordConfirm) {
      StockFactory.password({oldPassword: $scope.oldPassword, password: $scope.password})
      $scope.oldPassword = "";
      $scope.password = "";
      $scope.passwordConfirm = "";
    } else {
       $alert({content: 'Password does not match confirmation', duration: 3, animation:"am-fade-and-slide-top", placement: 'top-right', type: 'danger', show: true});
    }
  };

}]);

})();

