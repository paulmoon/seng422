'use strict';

angular.module('lscsClientApp')
  .controller('SurveyorCtrl', function ($scope, appAuthorize, $location, setting, $http) {
    var url = setting.apiurl + "/authorize_token/";
  	if(appAuthorize.isLoggedIn() == true){
  		$http.get(url)
  		.success(function(data){
  			if(data.role == 1){
  				$location.path("/manager");
  			} else if(data.role == 0){
  				$location.path("/admin");
  			}
  		})
  		.error(function(data){
  			console.log('Error' + data);
  		});

        var cl_url = setting.apiurl + "/checklist/";
        $http.get(cl_url)
        .success(function(data){
            $scope.cls = data
        })
        .error(function(data){
            console.log('Error' + data);
        });
    }
  });
