'use strict';

angular.module('lscsClientApp')
  .controller('LoginCtrl', function ($scope, $http, setting, $cookieStore, $location, appAuthorize, $q) {
  	// var url = setting.apiurl + "/verify_credentials";
  	var url = setting.apiurl + "/authorize_token/";
  	// var deferred = $q.defer();
  	// var promise = deferred.promise;
  	// var authorize_token = 'Token ' + $cookieStore.get("angWeatherToken");
  	// $http.defaults.headers.common.Authorization = authorize_token;
  	// $http.get(authorize_url)
  	// .success(function(data){
  	// 	console.log(data);
  	// 	if(data.role == 0){
  	// 		$location.path("/main");
  	// 	} else if(data.role == 1){
  	// 		$location.path("/main");
  	// 	} else if(data.role == 2) {
  	// 		$location.path("/main");
  	// 	}
  	// })
  	// .error(function(data){
  	// 	console.log(data);
  	// });
	if(appAuthorize.isLoggedIn() == true) {
		$http.get(url)
		.success(function(data){
			if(data.role == 0) {
				$location.path("/manager");
			} else if(data.role == 1) {
        $location.path("/surveyor");
      } else if(data.role == 2) {
        $location.path("/admin");
      }
		})
		.error(function(data){
			console.log(data);
		});
	} else {
		console.log("hi2");
	}
  	$scope.submit = function(){
  		var sendData = {
  			"username": $scope.username,
  			"password": $scope.password
  		};
  		appAuthorize.login(sendData);
  		
	  		// $http.post(url, sendData)
  		// .success(function(data){
  		// 	$cookieStore.put('angWeatherToken', data.token);
  		// 	$location.path("/main");
  		// })
  		// .error(function(data) {
    //     	console.log('Error: ' + data);
    //   });
  	}
  });
