'use strict';

var myApp = angular.module('myApp', [
  'ngRoute',
  'satellizer',
  'ui.bootstrap',
  'mgcrea.ngStrap',
  'myApp.login',
  'myApp.signup',
  'myApp.portfolio',
  'myApp.settings',
  'myApp.landing'
])

.config(['$routeProvider','$locationProvider', '$httpProvider', '$authProvider', function($routeProvider, $locationProvider, $httpProvider, $authProvider) {
  //$routeProvider.otherwise({
    //redirectTo: '/landing'
  //});

  $httpProvider.interceptors.push(function($q, $injector) {
    return {
      request: function(request) {
        // Add auth token for Silhouette if user is authenticated
        var $auth = $injector.get('$auth');
        if ($auth.isAuthenticated()) {
          request.headers['X-Auth-Token'] = $auth.getToken();
        }

        // Add CSRF token for the Play CSRF filter
        //var cookies = $injector.get('$cookies');
        //var token = cookies.get('PLAY_CSRF_TOKEN');
        //if (token) {
          //// Play looks for a token with the name Csrf-Token
          //// https://www.playframework.com/documentation/2.4.x/ScalaCsrf
          //request.headers['Csrf-Token'] = token;
        //}

        return request;
      },

      responseError: function(rejection) {
        if (rejection.status === 401) {
          var $auth = $injector.get('$auth');
          $auth.logout();
          $injector.get('$location').path('/login');
        }
        return $q.reject(rejection);
      }
    };
  });


  // Auth config
  $authProvider.httpInterceptor = true; // Add Authorization header to HTTP request
  $authProvider.loginOnSignup = true;
  $authProvider.loginRedirect = '/profile';
  $authProvider.logoutRedirect = '/landing';
  $authProvider.signupRedirect = '/profile';
  $authProvider.loginUrl = '/api/signIn';
  $authProvider.signupUrl = '/api/signUp';
  $authProvider.tokenName = 'token';
  $authProvider.tokenPrefix = 'satellizer'; // Local Storage name prefix
  $authProvider.authHeader = 'X-Auth-Token';
  $authProvider.platform = 'browser';
  $authProvider.storage = 'localStorage';

  $locationProvider.html5Mode(true);

  //function loginRequired($q, $location, $auth) {
    //var deferred = $q.defer();
    //if ($auth.isAuthenticated()) {
      //deferred.resolve();
    //} else {
      //$location.path('/login');
    //}
    //return deferred.promise;
  //}

}])

.run(function($rootScope, $location, $auth, $alert) {

  /**
   * The user data.
   * @type {{}}
   */
  $rootScope.user = {};

  $rootScope.logout = function() {
    $auth.logout();
    $location.path('/login');
    $alert({
      content: 'You have successfully signed out',
      animation: 'fadeZoomFadeDown',
      type: 'material',
      duration: 3
    });
  }

  var publicPaths = ['/login','/signup','/landing','/pricing','/features','/'];
  var angularPath = $location.path();
  // register listener to watch route changes
  $rootScope.$on( "$locationChangeStart", function(event, next, current) {
    if (!$auth.isAuthenticated()) {
      // not logged user, we should be going to /login
      if ( publicPaths.indexOf(angularPath) < 0 ) {
          $location.path('/login');
      }
    }
  });

});


(function () {
  'use strict';

angular.module('myApp.landing', ['ngRoute'])

// Declared route
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'partials/landing.html',
    controller: 'LandingController'
  });
}])

.controller('LandingController', ['$scope', '$http', function($scope, $http) {
  $scope.test = 'test';

}]);

})();


(function () {
  'use strict';

angular.module('myApp.login', ['ngRoute'])

// Declared route
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'partials/login.html',
    controller: 'LoginController'
  });
}])

.controller('LoginController', ['$scope', '$alert', '$auth', '$location', function($scope, $alert, $auth, $location) {
    $scope.rememberMe = false;

    $scope.submit = function() {
      //$auth.setStorage($scope.rememberMe ? 'localStorage' : 'sessionStorage');
      $auth.login({ email: $scope.email, password: $scope.password, rememberMe: $scope.rememberMe })
        .then(function() {
          $location.path('/settings');
          $alert({
            content: 'You have successfully signed in',
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });
        })
        .catch(function(response) {
          console.log(response);
          $alert({
            content: response.data.message,
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });
        });
    };

}]);

})();


(function () {
  'use strict';

angular.module('myApp.signup', ['ngRoute'])

// Declared route
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/signup', {
    templateUrl: 'partials/signup.html',
    controller: 'SignupController'
  });
}])

.controller('SignupController', ['$scope', '$alert', '$auth', function($scope, $alert, $auth) {

  $scope.submit = function() {
    $auth.signup({
      companyName: $scope.name,
      businessNumber: $scope.abn,
      email: $scope.email,
      password: $scope.password
    }).then(function() {
      $alert({
        content: 'You have successfully signed up',
        animation: 'fadeZoomFadeDown',
        type: 'material',
        duration: 3
      });
    }).catch(function(response) {
      $alert({
        content: response.data.message,
        animation: 'fadeZoomFadeDown',
        type: 'material',
        duration: 3
      });
    });
  };


}]);

})();


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


(function () {
  'use strict';

angular.module('myApp.portfolio', ['ngRoute'])

// Declared route
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/portfolio', {
    templateUrl: 'partials/portfolio.html',
    controller: 'PortfolioController'
  });
}])

.controller('PortfolioController', ['$scope', '$http', 'TFNDFactory', '$alert', function($scope, $http, TFNDFactory, $alert) {

  $scope.submit = function() {
    TFNDFactory.post({"tfn" : "nothing"})
      .then(function(data) {
        $alert({
          content: JSON.stringify(data.data),
          animation: 'fadeZoomFadeDown',
          type: 'material',
          duration: 3
        })
      })
    };

}]);

})();


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

