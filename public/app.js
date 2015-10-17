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

