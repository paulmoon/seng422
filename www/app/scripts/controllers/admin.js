'use strict';

angular.module('lscsClientApp')
  .controller('AdminCtrl', function ($scope, appAuthorize, $location, setting, $http) {
        var url = setting.apiurl + "/authorize_token/";
        if(appAuthorize.isLoggedIn() == true){
  		$http.get(url)
  		.success(function(data){
  			if(data.role == 1){
  				$location.path("/manager");
  			} else if(data.role == 2){
  				$location.path("/surveyor");
  			}
  		})
  		.error(function(data){
  			console.log('Error' + data);
  		});
  	}
  });