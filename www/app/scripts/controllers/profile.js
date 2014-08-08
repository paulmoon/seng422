'use strict';

angular.module('lscsClientApp')
  .controller('ProfileCtrl', function ($scope, appAuthorize, $location, setting, $http) {
  	var url;
  	if(appAuthorize.isLoggedIn() == true){
  		url = setting.apiurl + "/authorize_token/";
  		$http.get(url)
  		.success(function(data){
  			$scope.pd = data;
  			console.log(data);
  		})
  		.error(function(data){
  			console.log('Error' + data);
  		});
  	}
  });