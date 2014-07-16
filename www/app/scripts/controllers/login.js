'use strict';

angular.module('angWeatherAppApp')
  .controller('LoginCtrl', function ($scope, $http, setting, $cookieStore, $location) {
  	var url = setting.apiurl + "/verify_credentials";
  	var authorize_url = setting.apiurl + "/authorize_token/";
  	var authorize_token = 'Token ' + $cookieStore.get("angWeatherToken");
  	$http.defaults.headers.common.Authorization = authorize_token;
  	$http.get(authorize_url)
  	.success(function(data){
  		console.log(data);
  		if(data.role == 0){
  			$location.path("/main");
  		} else if(data.role == 1){
  			$location.path("/main");
  		} else if(data.role == 2) {
  			$location.path("/main");
  		}
  	})
  	.error(function(data){
  		console.log(data);
  	});
  	$scope.submit = function(){
  		var sendData = {
  			"username": $scope.username,
  			"password": $scope.password
  		};
  		$http.post(url, sendData)
  		.success(function(data){
  			$cookieStore.put('angWeatherToken', data.token);
  			$location.path("/main");
  		})
  		.error(function(data) {
        	console.log('Error: ' + data);
      });
  	}
  });
