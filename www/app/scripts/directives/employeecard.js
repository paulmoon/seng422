'use strict';

/**
 * @ngdoc directive
 * @name angWeatherAppApp.directive:employeecard
 * @description
 * # employeecard
 */
angular.module('lscsClientApp')
  .directive('ngEmployeecard', function ($modal, $http) {
    return {
        templateUrl: "scripts/directives/employeecard.html",
        restrict: 'E',
        scope: {
            employee:"="
        },
        controller: ['$scope', '$modal', '$http', function($scope, $modal, $http) {
            $scope.openEmployeeModal = function() {
                var modalInstance = $modal.open({
                    templateUrl: 'scripts/directives/employeeModal.html',
                    resolve: {
                        employee: function() {
                            return $scope.employee;
                        }
                    },
                    controller: ['$scope', '$modalInstance', 'employee', function($scope, $modalInstance, employee) {
                        $scope.roles = ["Admin", "Manager", "Surveyor"];
                        $scope.employee = employee;
                        $scope.newEmployee = angular.copy($scope.employee);

                        $scope.ok = function() {
                            $scope.employee = $scope.newEmployee;
                            $modalInstance.close($scope.employee);
                        };

                        $scope.cancel = function() {
                            $modalInstance.dismiss('cancel');
                        }
                    }]
                });

                modalInstance.result.then( function(newEmployee) {
                   var roles = ["Admin", "Manager", "Surveyor"];
                   $scope.employee = newEmployee;
                   $scope.employee.role = roles.indexOf($scope.employee.role).toString();
                   console.log($scope.employee);
                   $http.post('http://localhost:8000/employee/' + $scope.employee.id + '/', $scope.employee)
                       .success(function(status) {
                           console.log("Updated employee info");
                           $scope.employee.role = roles[$scope.employee.role];

                       })
                       .error(function (data, status, headers, config) {
                           $scope.employee.role = roles[$scope.employee.role];
                       });
                });
            };
        }]
    };
  });
