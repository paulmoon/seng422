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

        $scope.selectAll = function(){
          if ($scope.itemAll){
            $scope.itemAll = false;
          } else {
            $scope.itemAll = true;
          } 
          angular.forEach($scope.cls, function(cl){
            cl.Selected = $scope.itemAll;
          });
        };
        $scope.submit = function(){
          var checkbox;
          var cl_num_url;
          var temp;
          for(var i =0; i<data.length; i++){ 
            checkbox = document.getElementById(i);
            if(checkbox.checked){
              cl_num_url = setting.apiurl + "/checklist/"+data[i].id;
              temp = $scope.cls[i];
              temp.assignee = temp.assignee.id
              temp.assigner = temp.assigner.id
              console.log($scope.cls[i]);
              // temp = {
              //         "title":"ggchecklist2",
              //         "description":"is a god damn ggchecklist2",
              //         "json_contents":"checklist item",
              //         "assignee":"2",
              //         "address":"somewhere over the rainbow",
              //         "district":"14",
              //         "template":"1"
              //         };
              $http.post(cl_num_url, temp)
              // .success(function(data[i]){
              //   console.log(data);
              // })        
              // .error(function(data[i]){
              //   console.log('Error' + data);
              // });
            }
          };
        };

        })
        .error(function(data){
            console.log('Error' + data);
        });
    }
  });
