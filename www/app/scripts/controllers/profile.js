'use strict';

angular.module('lscsClientApp')
  .controller('ProfileCtrl', function ($scope, appAuthorize, $location, setting, $http, $modal, $log) {
  	var url;
  	if(appAuthorize.isLoggedIn() == true){
  		url = setting.apiurl + "/authorize_token/";
  		$http.get(url)
  		.success(function(data){
  			$scope.pd = data;
  			$scope.edit = function() {
  				var modalInstance = $modal.open({
	  				templateUrl: "views/profileModal.html",
	  				controller: ProfileModalInstanceCtrl,
				  	resolve: {
					    items: function () {
					      return $scope.pd;
					    }
					  }
	  			});

  				console.log(data);

	  			modalInstance.result.then(function (data) {
				  $scope.pd = data;
				  $http.post(setting.apiurl + "/employee/" + data.id + "/", data)
				  .success(function(data){
				  	console.log("im here" + data);
				  })	
				  .error(function(data){
				  	console.log("error " + data);
				  });
				}, function () {
				  $log.info('Modal dismissed at: ' + new Date());
				});
  			};

  		})
  		.error(function(data){
  			console.log('Error' + data);
  		});
  	}
  });