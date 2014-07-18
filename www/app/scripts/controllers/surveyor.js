'use strict';

angular.module('lscsClientApp')
  .controller('SurveyorCtrl', function ($scope, appAuthorize, $location, setting, $http) {
  	if(appAuthorize.isLoggedIn() == true){
  		$http.get(url)
  		.success(function(data){
  			if(data.role == 0){
  				$location.path("/manager");
  			} else if(data.role == 2){
  				$location.path("/admin");
  			}
  		})
  		.error(function(data){
  			console.log('Error' + data);
  		});
  	}
  });
