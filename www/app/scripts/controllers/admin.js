'use strict';

angular.module('angWeatherAppApp')
  .controller('AdminCtrl', function ($scope, appAuthorize, $location, setting, $http) {
  	if(appAuthorize.isLoggedIn() == true){
  		$http.get(url)
  		.success(function(data){
  			if(data.role == 0){
  				$location.path("/manager");
  			} else if(data.role == 1){
  				$location.path("/surveyor");
  			}
  		})
  		.error(function(data){
  			console.log('Error' + data);
  		});
  	}
  });