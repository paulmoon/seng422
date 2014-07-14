'use strict';

angular.module('angWeatherAppApp')
  .controller('LoginCtrl', function ($scope, $http, setting) {
  	var url = setting.apiurl + '/login'; 
  	$scope.submit = function(){
  		var sendData = {
  			"name": $scope.username,
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
