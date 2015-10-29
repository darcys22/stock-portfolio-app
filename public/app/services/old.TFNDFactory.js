(function () {
  'use strict';

angular.module('myApp')

.factory('TFNDFactory', function($http) {
  return {
    post: function(tfndobject) {
      return $http.post('/api/tfnd', {'tfnd': tfndobject} )
    }
  };
});

})();

