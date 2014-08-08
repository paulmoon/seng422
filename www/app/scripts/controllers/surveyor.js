'use strict';

angular.module('lscsClientApp')
.controller('SurveyorCtrl', function ($scope, appAuthorize, $location, setting, $http, $modal, stateService) {
  var url = setting.apiurl + "/authorize_token/";
  // $scope.json_contents = JSON.parse("{\"Question 1\": \"Very first question\", \"Question 2\": \"Second question??\", \"Question 3\": \"LAST QUESTION\"}");
  $scope.json_contents = [];

  if (appAuthorize.isLoggedIn()) {
    $http.get(url)
    .success(function(data) {
      if (data.role == 1) {
        $location.path("/manager");
      } else if (data.role == 0) {
        $location.path("/admin");
      }
    })
    .error(function(data){
      console.log('Error' + data);
    });

    var cl_url = setting.apiurl + "/checklist/";
    $http.get(cl_url)
    .success(function(data){
      $scope.cls = data;

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
        for (var i = 0; i < data.length; i++) { 
          checkbox = document.getElementById(i);
          if (checkbox.checked) {
            cl_num_url = setting.apiurl + "/checklist/" + data[i].id;
            temp = $scope.cls[i];
            temp.assignee = temp.assignee.id;
            temp.assigner = temp.assigner.id;
            $http.post(cl_num_url, temp);
          }
        }
      };
    })
    .error(function(data){
      console.log('Error' + data);
    });
  };

  $scope.openChecklistModal = function(selectedChecklistID) {
    console.log('Opening a modal with ID ' + selectedChecklistID);
    var modalInstance = $modal.open({
      templateUrl: 'scripts/directives/checklistModal.html',
      resolve: {
        selectedChecklistID: function() {
          return selectedChecklistID;
        }
      },
      controller: ['$scope', '$modalInstance', '$http', 'selectedChecklistID', 'stateService', 
        function($scope, $modalInstance, $http, selectedChecklistID) {
          stateService.getChecklistByID(selectedChecklistID).then(function() {
            $scope.checklist = stateService.getSelectedChecklist();
            // console.log($scope.checklist);
            $scope.json_contents = JSON.parse($scope.checklist['json_contents']);
            console.log($scope.json_contents);
          });

          $scope.saveAnswer = function(question, answer) {
            console.log($scope.json_contents);
            $scope.json_contents[question] = answer;
          };

          $scope.saveChecklist = function() {
            var saved = {
              json_contents: JSON.stringify($scope.json_contents),
              status: 'P'
            };

            $modalInstance.close({id: $scope.checklist.id, savedContents: saved});
          };

          $scope.submitChecklist = function() {
            var saved = {
              json_contents: JSON.stringify($scope.json_contents),
              status: 'C'
            };

            $modalInstance.close({id: $scope.checklist.id, savedContents: saved});
          };

          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
      }]
    });

    modalInstance.result.then(function(savedChecklist) {
      $http.post('http://localhost:8000/checklist/' + savedChecklist.id, savedChecklist.savedContents)
        .success(function() {
            console.log('Successfully changed the checklist');
        }).error(function() {
            console.log('Error creating checklist');
        });
    });
  };
});
