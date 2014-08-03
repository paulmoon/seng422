'use strict';

/**
 * @ngdoc directive
 * @name angWeatherAppApp.directive:EmployeeList
 * @description
 * # EmployeeList
 */
angular.module('lscsClientApp')
  .directive('ngEmployeelist', function ($rootScope, $http) {
    return {
        templateUrl: 'scripts/directives/employeelist.html',
        restrict: 'E',
        transclude: true,
        scope: {

        },
        controller: ['$rootScope', '$scope', function($rootScope, $scope) {
            $scope.employees = [];
            var roles = ["Admin", "Manager", "Surveyor"];
            $scope.init = function() {
                $http.get('http://localhost:8000/employees/').success(function (data) {
                    angular.forEach(data, function (value) {
                        value.role = roles[value.role];
                        $scope.employees.push(value);
                    });
                })
            };
            $scope.init();


            $rootScope.$on('newEmployeeCreated', function(event, employee) {
                $scope.employees.push(employee);
            });
        }]
    };
  });
