'use strict';

angular.module('lscsClientApp')
  .controller('ManagerCtrl', function ($scope, appAuthorize, $location, setting, $http) {
  	var url = setting.apiurl + "/authorize_token/";
  	if(appAuthorize.isLoggedIn() == true){
  		$http.get(url)
  		.success(function(data){
  			if(data.role == 2){
  				$location.path("/surveyor");
  			} else if(data.role == 0){
  				$location.path("/admin");
  			}
  		})
  		.error(function(data){
  			console.log('Error' + data);
  		});
  	}
  });
