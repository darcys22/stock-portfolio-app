(function () {
  'use strict';

angular.module('myApp')

.factory('UserFactory', function($http) {
  return {
    get: function() {
      return $http.get('/api/user');
    }
  };
});

})();

