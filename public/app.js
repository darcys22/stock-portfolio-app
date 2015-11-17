'use strict';

var myApp = angular.module('myApp', [
  'ngRoute',
  'ngSanitize',
  'ngAnimate',
  'satellizer',
  'mgcrea.ngStrap',
  'fiestah.money',
  'ngAnimate',
  'myApp.login',
  'myApp.signup',
  'myApp.portfolio',
  'myApp.settings',
  'myApp.password',
  'myApp.forgot',
  'myApp.landing'
])

.config(['$sceDelegateProvider', '$routeProvider','$locationProvider', '$httpProvider', '$authProvider', function($sceDelegateProvider ,$routeProvider, $locationProvider, $httpProvider, $authProvider) {

  $sceDelegateProvider.resourceUrlWhitelist(['self', 'query.yahooapis.com/**']);

  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.withCredentials = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $httpProvider.defaults.headers.common["Accept"] = "application/json";
  $httpProvider.defaults.headers.common["Content-Type"] = "application/json";

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
  $authProvider.loginOnSignup = false;
  $authProvider.loginRedirect = '/portfolio';
  $authProvider.logoutRedirect = '/landing';
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
      animation:"am-fade-and-slide-top",
      type: 'material',
      duration: 3
    });
  }

  var publicPaths = ['login','signup', 'password', ,'forgot', 'landing','pricing','features',''];
  var angularPath = $location.path().split('/')[1];
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

