'use strict';

angular.module('lscsClientApp')
  .controller('HeaderCtrl', function ($scope, $http, setting, appAuthorize, $location) {
  	var url = setting.apiurl + "/authorize_token/";
  	if(appAuthorize.isLoggedIn() == true){
  		$http.get(url)
	  	.success(function(data){
	  		$scope.fullname = {
	  			firstname: data.first_name,
	  			lastname: data.last_name
	  		}
	  	})
	  	.error(function(data){
	  		console.log('Error: ' + data);
	  	})
  	} else {
  		$location.path("/login");
  	}
  	$scope.logout = function(){
  		appAuthorize.logout();
  	}
  })
  .directive('myName', function() {
  	return {
  		template: '{{fullname.firstname}} {{fullname.lastname}}'
  	};
  });