'use strict';

angular
  .module('lscsClientApp', [
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
              var currentToken = $cookieStore.get("angWeatherToken");
              var authorize_token = "Token " + currentToken;
              $http.defaults.headers.common.Authorization = authorize_token;
              $http.get(authorize_url)
              .success(function(data){
                
                if(data.role == 0) {
                  $location.path("/manager");
                } else if(data.role == 1) {
                  $location.path("/surveyor");
                } else if(data.role == 2) {
                  $location.path("/admin");
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
        logout: function () {
          $cookieStore.remove('angWeatherToken');
          $location.path("/login");
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
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/manager', {
        templateUrl: 'views/manager.html',
        controller: 'ManagerCtrl'
      })
      .when('/surveyor', {
        templateUrl: 'views/surveyor.html',
        controller: 'SurveyorCtrl'
      })
      .when('/admin', {
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl'
      })
      .when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl'
      })
      .otherwise({
        redirectTo: '/login'
      });
  });
