'use strict';

angular.module('lscsClientApp')
  .controller('ManagerCtrl', function ($scope, appAuthorize, $location, setting, $http, $modal, $log) {
  	var url = setting.apiurl + "/authorize_token/";
  	var url_checklist = setting.apiurl + "/checklist/";
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

  	$http.get(url_checklist)
  	.success(function(data){
  		$scope.CompletedList = [];
  		$scope.OngoingList = [];
  		angular.forEach(data, function(item){
  			if(item.status == 'C') {
  				$scope.CompletedList.push(item);
  			} else {
  				$scope.OngoingList.push(item);
  			}
  		});
  	})
  	.error(function(data){
  		console.log('Error' + data);
  	});

  	$scope.headerTabs = [
            {
                'headerTabId': 1,
                'header': 'Ongoing Surveys',
                'icon': 'glyphicon-time',
            },
            {
                'headerTabId': 2,
                'header': 'Completed Surveys',
                'icon': 'glyphicon-ok',
            },
            {
                'headerTabId': 3,
                'header': 'Surveyors',
                'icon': 'glyphicon-user',
            }
        ];
    $scope.selected = 0;
    $scope.template = 'page' + 0;

    $scope.select= function(index) {
       $scope.selected = index;
       $scope.template = 'page' + index;
    };

	$scope.items = ['item1', 'item2', 'item3'];

	$scope.open_survey = function (checklist) {
		var modalInstance = $modal.open({
		  	templateUrl: 'views/manager-survey-view.html',
		  	controller: ManagerModalInstanceCtrl,
		  	size: 'lg',
		  	resolve: {
		    items: function () {
		      return checklist;
		    }
		  }
		});

		modalInstance.result.then(function (selectedItem) {
		  $scope.selected = selectedItem;
		}, function () {
		  $log.info('Modal dismissed at: ' + new Date());
		});
	};

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
  })
  .directive("ngWeather", function(){
	return {
		link: function(scope, element, attributes){
		$.simpleWeather({
	    location: 'Austin, TX',
	    woeid: '',
	    unit: 'f',
	    success: function(weather) {
	      var html = '<h2><i class="icon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</h2>';
	      // html += '<ul><li>'+weather.city+', '+weather.region+'</li>';
	      // html += '<li class="currently">'+weather.currently+'</li>';
	      // html += '<li>'+weather.wind.direction+' '+weather.wind.speed+' '+weather.units.speed+'</li></ul>';
	  
	      angular.element("#weather").html(html);
	      console.log(weather);
	    },
	    error: function(error) {
	      console.log(error);
	    }
	  });
	},
	template: "<div id='weather'></div>"
	}
});

