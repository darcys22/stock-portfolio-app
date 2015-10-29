(function () {

  var injectParams = ['$scope', '$rootScope', '$modal', '$log', '$cookies', '$route'];

  var modal = function ($scope, $rootScope, $modal, $log, $cookies, $route, bookService) {

    var content = {
      recover: {
        title   : 'Recover Your Books',
        content : 'If you had previously entered an email address, you can enter it here to recover your cookie after wiping',
        result  : function (email) {
          var cookie = bookService.recoverBooks(email);
          cookie.then( function(newCookie) {
            var expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 365 * 10);
            $cookies.put('current.user', newCookie, {'expires': expireDate})
            $rootScope.userId = newCookie;
            $route.reload();
          })
        }
      },
      addEmail: {
        title   : 'Add Your Email',
        content : 'HumanRestart.com uses a cookie to store your ID, this means that it can easily be lost by deleting browser data. To allow recovery of your books after wiping please add an email address to your account',
        result  : function (email) {
          bookService.addEmail($rootScope.userId, email);
        }
      }
    };

    $scope.email = '';

    $scope.animationsEnabled = true;

    $scope.open = function (direction) {

      var modalInstance = $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'partials/modal.html',
        controller: 'ModalInstanceCtrl',
        resolve: {
          contents: function () {
            return content[direction];
          }
        }
      });

      modalInstance.result.then(content[direction].result);
    };
    
    $scope.toggleAnimation = function () {
      $scope.animationsEnabled = !$scope.animationsEnabled;
    };

  };

  modal.$inject = injectParams;
  angular.module('myApp').controller('modalCtrl', modal);




  var instanceInjectParams = [ '$scope', '$modalInstance', 'contents'];
  var modalInstance = function ($scope, $modalInstance, contents) {

    $scope.content = contents;

    $scope.ok = function () {
      $modalInstance.close($scope.email);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  };

  modalInstance.$inject = instanceInjectParams;
  angular.module('myApp').controller('ModalInstanceCtrl', modalInstance);

}());

