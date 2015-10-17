(function () {
  'use strict';

angular.module('myApp')


.controller('NavigationController', ['$rootScope', '$scope', '$auth', 'UserFactory', function($rootScope, $scope, $auth, UserFactory) {
  $scope.$watch( function( $scope ) { return $scope.isAuthenticated() },
    function ( newValue ) {
      if(newValue) {
        UserFactory.get()
          .success(function(data) {
            $rootScope.user = data;
          })
      }
    }
  )

  $scope.isAuthenticated = function() {
    return $auth.isAuthenticated();
  };

  //$scope.logout = function() {
    //$auth.logout();
  //}

}]);

})();

