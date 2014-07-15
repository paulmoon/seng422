'use strict';

angular.module('angWeatherAppApp')
  .controller('LoginCtrl', function ($scope, $http, setting, $cookieStore) {
  	var url = setting.apiurl + "/verify_credentials";
  	$scope.submit = function(){
  		var sendData = {
  			"username": $scope.username,
  			"password": $scope.password
  		};
  		$http.post(url, sendData)
  		.success(function(data){
  			$cookieStore.put('angWeatherToken', data.token);
  			console.log($cookieStore.get("angWeatherToken"));
  		})
  		.error(function(data) {
        	console.log('Error: ' + data);
      });
  	}
  });
