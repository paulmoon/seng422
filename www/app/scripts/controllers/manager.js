'use strict';

angular.module('lscsClientApp')
  .controller('ManagerCtrl', function ($scope, appAuthorize, $location, setting, $http, $modal, $log) {
  	var url = setting.apiurl + "/authorize_token/";
  	var url_checklist = setting.apiurl + "/checklist/";
  	var url_employee = setting.apiurl + "/employees/";
  	$scope.CompletedList = [];
	$scope.OngoingList = [];
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

    $scope.openNewChecklist = function() {
        $location.path("/checklistCreation");
    };

  	$http.get(url_employee)
  	.success(function(empdata){
  		var employeeCount = 0;
  		$scope.EmployeeList = [];
  		angular.forEach(empdata, function(item){
  			if(item.role == 2){
  				$scope.EmployeeList.push(item);
  				employeeCount++;
  			}
  		});
  		$http.get(url_checklist)
	  	.success(function(data){
	  		var completedCount = 0,
	  		ongoingCount = 0;
	  		angular.forEach(data, function(item){
	  			if(item.status == 'C') {
	  				$scope.CompletedList.push(item);
	  				completedCount++;
	  			} else {
	  				$scope.OngoingList.push(item);
	  				ongoingCount++;
	  			}
	  		});
	  		$scope.headerTabs = [
            {
                'headerTabId': 1,
                'header': 'Ongoing Surveys',
                'icon': 'glyphicon-time',
                'count': ongoingCount,
            },
            {
                'headerTabId': 2,
                'header': 'Completed Surveys',
                'icon': 'glyphicon-ok',
                'count': completedCount,
            },
            {
                'headerTabId': 3,
                'header': 'Surveyors',
                'icon': 'glyphicon-user',
                'count': employeeCount,
            }
        ];
	    $scope.selected = 0;
	    $scope.template = 'page' + 0;

	    $scope.select= function(index) {
	       $scope.selected = index;
	       $scope.template = 'page' + index;
	    };
	  	})
	  	.error(function(data){
	  		console.log('Error ' + data);
	  	});
  	})
  	.error(function(empdata){
  		console.log('Error ' + empdata);
  	});


	$scope.items = ['item1', 'item2', 'item3'];

	$scope.delete_survey = function (id) {
		var url_survey_delete = setting.apiurl + '/checklist/' + id +'/delete';
		$http.delete(url_survey_delete)
		.success(function(data){
			angular.forEach($scope.CompletedList, function(item, index){
	  			if(item.id == id){
	  				$scope.CompletedList.splice(index, 1);
	  			}
	  		});

			console.log(id + ' has been deleted.');
		})
		.error(function(data){
			console.log('Error: ' + data);
		});
	}

	$scope.open_survey = function (checklist) {
		var modalInstance = $modal.open({
		  	templateUrl: 'views/manager-survey-view.html',
        controller: ['$scope', '$modalInstance', 'checklist', 
            function($scope, $modalInstance, checklist) {

          $scope.checklist = checklist;
          $scope.json_contents = JSON.parse($scope.checklist['json_contents']);

          $scope.close = function () {
            $modalInstance.dismiss('close');
          };
        }],

		  	size: 'lg',
		  	resolve: {
  		    checklist: function () {
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

	$scope.open_location = function (checklist) {
		var modalInstance = $modal.open({
		  	templateUrl: 'views/manager-location-modal.html',
		  	controller: ManagerLocationModalInstanceCtrl,
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
	}

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
  })
  .directive("ngWeather", function(){
	return {
		scope: {
			locationMap: '='
		},
		link: function(scope, element, attributes, $http){
		$.simpleWeather({
	    location: scope.locationMap,
	    woeid: '',
	    unit: 'f',
	    success: function(weather) {
	      var html = '<h2><i class="icon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</h2>';
	      html += '<ul><li>'+weather.city+', '+weather.region+'</li>';
	      html += '<li class="currently">'+weather.currently+'</li>';
	      html += '<li>'+weather.wind.direction+' '+weather.wind.speed+' '+weather.units.speed+'</li></ul>';
	  
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

