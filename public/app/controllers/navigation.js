(function () {
  'use strict';

angular.module('myApp')

.config(function($modalProvider) {
  angular.extend($modalProvider.defaults, {
    html: true
  });
})


.controller('NavigationController', ['$rootScope', '$scope', '$auth', 'UserFactory', function($rootScope, $scope, $auth, UserFactory) {
  $scope.$watch( function( $scope ) { return $scope.isAuthenticated() },
    function ( newValue ) {
      if(newValue) {
        UserFactory.get()
          .success(function(data) {
            $rootScope.user = data;
            $scope.dropdown.push(
              {
                "text": $rootScope.user.email,
                "href": "/portfolio"
              });
          })
      }
    }
  )

  $scope.isAuthenticated = function() {
    return $auth.isAuthenticated();
  };

  $scope.dropdown = [
    {
      "text": "<i class=\"fa fa-wrench\"></i> Settings",
      "href": "/settings"
    },
    {
      "text": "<i class=\"fa fa-globe\"></i> Logout",
      "click": "logout()"
    },
    {
      "divider": true
    },
    {
      "text": "{{user.email}}" ,
      "click": ""
    }
  ];

  //$scope.logout = function() {
    //$auth.logout();
  //}

}]);

})();

