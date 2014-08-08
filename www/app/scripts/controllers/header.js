'use strict';

angular.module('lscsClientApp')
  .controller('HeaderController', function ($scope, $http, setting, appAuthorize, $location) {
    console.log("I AM A HEADER CONTROLLER");
    var url = setting.apiurl + "/authorize_token/";
    $scope.loggedIn = appAuthorize.isLoggedIn();

    if ($scope.loggedIn === true) {
      console.log('Redirecting...');
      $http.get(url)
      .success(function(data){
        if (data.role == 0 && $location.path() != '/profile') {
          $location.path("/admin");
        } else if (data.role == 1 && $location.path() != '/profile' && $location.path() != '/checklistCreation') {
          $location.path("/manager");
        } else if (data.role == 2 && $location.path() != '/profile') {
          $location.path("/surveyor");
        }
      })
      .error(function(data){
        console.log(data);
      });
      // if (data.role === 0) {
      //   $location.path('/admin');
      // } else if (data.role === 1) {
      //   $location.path('/manager');
      // } else if(data.role === 2) {
      //   $location.path('/surveyor');
      // }
    } else {
      $location.path('/');
    }

    $scope.login = function() {
      var sendData = {
        'username': this.username,
        'password': this.password
      };
      appAuthorize.login(sendData);
    };

    $scope.logout = function() {
      appAuthorize.logout();
    };

    $scope.profile = function() {
        $location.path("/profile");
    }
  })
  .directive('myName', function() {
    return {
      template: '{{fullname.firstname}} {{fullname.lastname}}'
    };
  });
