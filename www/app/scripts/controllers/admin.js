'use strict';

angular.module('lscsClientApp')
  .controller('AdminCtrl', function ($rootScope, $scope, appAuthorize, $location, setting, $http, $modal) {
        var url = setting.apiurl + "/authorize_token/";
        if(appAuthorize.isLoggedIn() == true){
            $http.get(url)
            .success(function(data){
                if(data.role == 1){
                    $location.path("/manager");
                } else if(data.role == 2){
                    $location.path("/surveyor");
                }
            })
            .error(function(data){
                console.log('Error' + data);
            });
    	}

        $scope.openCreate = function() {
            var modalInstance = $modal.open({
                templateUrl: 'scripts/directives/newEmployeeModal.html',
                controller: ['$rootScope', '$scope', '$modalInstance', function($rootScope, $scope, $modalInstance) {
                    $scope.roles = ["Admin", "Manager", "Surveyor"];
                    $scope.newEmployee = {}
                    $scope.newEmployee.role = $scope.roles[0];
                    $scope.ok = function() {
                        $scope.newEmployee.role = $scope.roles.indexOf($scope.newEmployee.role);
                        $modalInstance.close($scope.newEmployee);
                    };

                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    }
                }]
            });

            modalInstance.result.then(function(sendEmployee) {
                console.log(sendEmployee);
                $http.post('http://localhost:8000/register/', sendEmployee)
                    .success(function() {
                        console.log("Created new employee");
                        $rootScope.broadcast('newEmployeeCreated', sendEmployee);
                    }).error(function() {
                        console.log("Could not create employee");
                    });
            });
        };
  });