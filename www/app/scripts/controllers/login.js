'use strict';

angular.module('angWeatherAppApp')
  .controller('LoginCtrl', function ($scope, $http, setting) {
  	var url = setting.apiurl + '/verify_credentials'; 
  	$scope.submit = function(){
  		var sendData = {
  			"usernamename": $scope.username,
  			"password": $scope.password
  		};
  		$http.post(url, sendData)
  		.success(function(data){
  			console.log(data);
  		})
  		.error(function(data) {
        	console.log('Error: ' + data);
      });
  	}
  });
