'use strict';

/**
 * @ngdoc directive
 * @name angWeatherAppApp.directive:employeecard
 * @description
 * # employeecard
 */
angular.module('lscsClientApp')
  .directive('ngEmployeecard', function ($modal) {
    return {
        templateUrl: "scripts/directives/employeecard.html",
        restrict: 'E',
        scope: {
            employee:"="
        },
        controller: ['$scope', '$modal', function($scope, $modal) {
            $scope.openEmployeeModal = function() {
                var modalInstance = $modal.open({
                    templateUrl: 'scripts/directives/employeeModal.html',
//                    windowClass: 'employeeModal',
                    resolve: {
                        employees: function() {
                            return $scope.employee;
                        }
                    },
                    controller: ['$scope', '$modalInstance', 'employees', function($scope, $modalInstance, employees) {
                        console.log(employees);
                        $scope.ok = function() {
                            $modalInstance.close(employees);
                        };
                        $scope.cancel = function() {
                            $modalInstance.dismiss('cancel');
                        }
                    }]
                });
            };
        }]
    };
  });
