(function () {
  'use strict';

angular.module('myApp')

.factory('StockFactory', function($http, $q, $filter) {

  var deferredbullshit = function(f) {
    return function() {
      var deferred = $q.defer();
      f.apply(this, arguments)
        .success(function(data) {
          deferred.resolve(data);
        }).error(function(data) {
          deferred.reject(data);
        });
      return deferred.promise;
    }
  };

  return {
    getPortfolio: deferredbullshit(function() { return $http.get('/api/portfolio') }),
    getHistory: deferredbullshit(function() { return $http.get('/api/history') }),
    buy: deferredbullshit(function(buyObject) { return $http.post('/api/buy', buyObject)}),
    sell: deferredbullshit(function(sellObject) { return $http.post('/api/sell', sellObject) }),
    getYQL: deferredbullshit(function(yqlurl) { return $http({method: 'JSONP', url: (yqlurl + '&callback=JSON_CALLBACK') }) })

  };

});

})();

