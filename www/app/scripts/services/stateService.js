'use strict';

angular.module('lscsClientApp')
.service('stateService', function ($cookieStore, $http) {
    var selectedChecklist;

    this.getChecklistByID = function(checklistID) {
      return $http.get(this.getServerAddress() + 'checklist/' + checklistID)
      .success(function(data) {
        selectedChecklist = data;
      })
      .error(function(data) {
        console.log('Error while getting the checklist with ID + ' + checklistID);
      });
    };

    // this.submitChecklist = function(checklist) {
        
    // }


    this.getSelectedChecklist = function() {
        return selectedChecklist;
    };

    this.getServerAddress = function() {
        return 'http://localhost:8000/';
    };
});
