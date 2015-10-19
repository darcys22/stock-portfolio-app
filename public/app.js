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

  $httpProvider.interceptors.push(function($q, $injector) {
    return {
      request: function(request) {
        // Add auth token for Silhouette if user is authenticated
        var $auth = $injector.get('$auth');
        if ($auth.isAuthenticated()) {
          request.headers['Authorization'] = 'JWT ' + $auth.getToken();
        }

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
  $authProvider.loginRedirect = '/portfolio';
  $authProvider.logoutRedirect = '/landing';
  $authProvider.signupRedirect = '/portfolio';
  $authProvider.loginUrl = '/api/signIn';
  $authProvider.signupUrl = '/api/signUp';
  $authProvider.tokenName = 'token';
  $authProvider.tokenPrefix = 'satellizer'; // Local Storage name prefix
  $authProvider.authHeader = 'Authorization';
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

