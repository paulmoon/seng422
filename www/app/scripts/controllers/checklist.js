'use strict';

angular.module('lscsClientApp')
  .controller('ChecklistController', function ($scope, $http) {
    $scope.init = function(checklistID) {
        console.log(checklistID);
        $scope.checklistID = checklistID;

        $http.get('http://localhost:8000/checklist/' + checklistID)
        .success(function(data) {
            console.log("Successfully got the checklist.");
            
            $scope.checklist = data;
            $scope.json_contents = JSON.parse($scope.checklist["json_contents"]);
        })
        .error(function(data) {
            console.log("Error while getting the checklist.");
        })
    }

    $scope.submitChecklist = function() {
        $http.post('http://localhost:8000/checklist/' + checklistID)
        .success(function(data) {
            console.log('Successfully submitted a checklist' + data);
          })
        .error(function(data) {
            console.log('Error while submitting a checklist' + data);
          });
      };
  });
