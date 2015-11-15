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
    deletePortfolio: deferredbullshit(function(id) { return $http.delete('/api/portfolio/' + id) }),
    getHistory: deferredbullshit(function() { return $http.get('/api/history') }),
    deleteHistory: deferredbullshit(function(id) { return $http.delete('/api/history/' + id) }),
    buy: deferredbullshit(function(buyObject) { return $http.post('/api/buy', buyObject)}),
    sell: deferredbullshit(function(sellObject) { return $http.post('/api/sell', sellObject) }),
    getYQL: deferredbullshit(function(yqlurl) { return $http({method: 'JSONP', url: (yqlurl + '&callback=JSON_CALLBACK') }) }),
    password: deferredbullshit(function(passObject) { return $http.post('/api/password', passObject)}),
    forgot: deferredbullshit(function(passObject) { return $http.post('/api/forgot', passObject)}),
    user: deferredbullshit(function(passObject) { return $http.post('/api/user', passObject)}),

  };

});

})();

