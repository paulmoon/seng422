'use strict';

/**
 * @ngdoc directive
 * @name angWeatherAppApp.directive:employeecard
 * @description
 * # employeecard
 */
angular.module('lscsClientApp')
  .directive('ngEmployeecard', function () {
    return {
        templateUrl: "scripts/directives/employeecard.html",
        restrict: 'E',
        scope: {
            employee:"="
        },
        controller: ['$scope', function($scope) {

        }]
    };
  });
