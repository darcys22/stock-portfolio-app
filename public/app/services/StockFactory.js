(function () {
  'use strict';

angular.module('myApp')

.factory('StockFactory', function($http) {
  return {
    get: function() {
      return $http.get('/api/portfolio')
    }
  };
});

})();

