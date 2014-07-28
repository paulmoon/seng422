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
        controller: ['$scope', function($scope) {
            $scope.employees = [];
            $scope.init = function() {
                $http.get('http://localhost:8000/employees/').success(function (data) {
                    angular.forEach(data, function (value) {
                        $scope.employees.push(value);
                    });
                })
            };
            $scope.init();
        }]
    };
  });
