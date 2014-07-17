'use strict';

angular
  .module('angWeatherAppApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'mm.foundation'
  ])
  .constant('setting', {apiurl: 'http://localhost:8000'})
  .factory('appAuthorize', function ($cookieStore, $http, $location, setting){
      return {
        login: function (credentials) {
            var url = setting.apiurl + "/verify_credentials";
            var authorize_url = setting.apiurl + "/authorize_token/";
            $http.post(url, credentials)
            .success(function(data){
              $cookieStore.put("angWeatherToken", data.token);
              console.log("Added token to cookie store");
              $http.get(authorize_url)
              .success(function(data){
                if(data.role == 0) {
                  $location.path("/main");
                }
              })
              .error(function(data){
                console.log(data);
              });
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        },
        isLoggedIn: function () {
          var url = setting.apiurl + "/authorize_token/",
          currentToken = $cookieStore.get("angWeatherToken"),
          authorize_token = "Token " + currentToken;
          if(currentToken === undefined) {
            console.log("currentToken is undefined");
            return false;
          } else {
            $http.defaults.headers.common.Authorization = authorize_token;
            return true;
          }
        }
      }
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
