(function () {
  'use strict';

angular.module('myApp.settings', ['ngRoute'])

// Declared route
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/settings', {
    templateUrl: 'partials/profile.html',
    controller: 'SettingsController'
    //resolve: {
      //loginRequired: loginRequired
    //}
  });
}])

.controller('SettingsController', ['$scope', '$http', function($scope, $http) {
  $scope.test = 'test';

}]);

})();

