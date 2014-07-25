'use strict';

angular.module('lscsClientApp')
  .controller('ManagerCtrl', function ($scope, appAuthorize, $location, setting, $http, $modal, $log) {
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
  	$scope.headerTabs = [
            {
                'headerTabId': 1,
                'header': 'Ongoing Surveys',
                'icon': 'fi-clock',
            },
            {
                'headerTabId': 2,
                'header': 'Completed Surveys',
                'icon': 'fi-check',
            },
            {
                'headerTabId': 3,
                'header': 'Surveyors',
                'icon': 'fi-torsos-all',
            }
        ];
    $scope.selected = 0;
    $scope.template = 'page' + 0;

    $scope.select= function(index) {
       $scope.selected = index;
       $scope.template = 'page' + index;
    };

	$scope.items = ['item1', 'item2', 'item3'];

	$scope.open = function () {

	var modalInstance = $modal.open({
	  templateUrl: 'views/manager-modal.html',
	  controller: ManagerModalInstanceCtrl,
	  resolve: {
	    items: function () {
	      return $scope.items;
	    }
	  }
	});

	modalInstance.result.then(function (selectedItem) {
	  $scope.selected = selectedItem;
	}, function () {
	  $log.info('Modal dismissed at: ' + new Date());
	});
	};
	$scope.map = {
	    center: {
	        latitude: 45,
	        longitude: -73
	    },
	    zoom: 9
	};
		$.simpleWeather({
	    location: 'Austin, TX',
	    woeid: '',
	    unit: 'f',
	    success: function(weather) {
	      html = '<p>'+weather.temp+'&deg;'+weather.units.temp+'</p>';
	  
	      $("#weather").html(html);
	    },
	    error: function(error) {
	      $("#weather").html('<p>'+error+'</p>');
	    }
	  });
  });

