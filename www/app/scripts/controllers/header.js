'use strict';

angular.module('lscsClientApp')
  .controller('HeaderController', function ($scope, $http, setting, appAuthorize, $location) {
    console.log("I AM A HEADER CONTROLLER");

    $scope.loggedIn = appAuthorize.isLoggedIn();

    if ($scope.loggedIn === true) {
      console.log('Redirecting...');

      
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
  })
  .directive('myName', function() {
    return {
      template: '{{fullname.firstname}} {{fullname.lastname}}'
    };
  });
