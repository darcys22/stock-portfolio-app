(function () {
  'use strict';

angular.module('myApp')

.config(function($modalProvider) {
  angular.extend($modalProvider.defaults, {
    html: true
  });
})


.controller('NavigationController', ['$rootScope', '$scope', '$auth', function($rootScope, $scope, $auth) {

  $scope.isAuthenticated = function() {
    return $auth.isAuthenticated();
  };

  $rootScope.$on('userEvent', function() {
    $scope.dropdown.push(
      {
        "text": $rootScope.user.email,
        "href": "/portfolio"
      });
  }); 


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
    }
  ];


}]);

})();

