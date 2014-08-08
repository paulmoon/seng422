'use strict';

/**
 * @ngdoc function
 * @name angWeatherAppApp.controller:ChecklistcreationcontrollerCtrl
 * @description
 * # ChecklistcreationcontrollerCtrl
 * Controller of the angWeatherAppApp
 */
angular.module('lscsClientApp')
  .controller('ChecklistCreationCtrl', function ($scope, $modal, $http, $location) {
    $scope.inputs = [];

    $scope.newChecklist = function() {
        var i = {
          inputType: 'checkbox',
          checked: false,
          label: 'Insert information here'
        };
        $scope.inputs.push(i);
    }
    $scope.callConsole = function() {
        console.log($scope.inputs);
    }

    $scope.header = {
        title: "Title",
        description: "Description",
        filenumber: "File #",
        landDistrict: "Land District",
        address: "Address"
    };
    $scope.createSurvey = function() {
        var modalInstance = $modal.open({
            templateUrl: 'views/checklistCreationModal.html',
            resolve: {
                information: function() {
                    var i = {
                        inputs: $scope.inputs,
                        header: $scope.header
                    };
                    return i;
                }
            },
            controller: ['$scope', '$modalInstance', '$http', 'information', function($scope, $modalInstance, $http, information) {
                $scope.surveyors = [];
                $scope.checklist = {};
                $scope.s = {};
                $http.get("http://localhost:8000/surveyors/")
                    .success(function(data) {
                        angular.forEach(data, function(value) {
                            $scope.surveyors.push(value);
                        });
                    }).error(function() {
                        console.log("Didn't work");
                    });

                $scope.ok = function() {
                    $scope.checklist.title = information.header.title;
                    $scope.checklist.description = information.header.description;
                    $scope.checklist.filenumber = information.header.filenumber;
                    $scope.checklist.district = information.header.landDistrict;
                    $scope.checklist.json_contents = {};
                    $scope.checklist.assignee = $scope.s.surveyor.id.toString();
                    $scope.checklist.status = 'P';
                    $scope.checklist.address = information.header.address;
                    $scope.checklist.template = "1";
                    angular.forEach(information.inputs, function(value) {
                        $scope.checklist.json_contents[value.label] = "Unanswered";
                    });
                    $scope.checklist.json_contents = JSON.stringify($scope.checklist.json_contents);
                    console.log($scope.checklist);
                    $modalInstance.close($scope.checklist);
                };

                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                }
            }]
        });

        modalInstance.result.then(function(checklist) {
           $http.post("http://localhost:8000/checklist/", checklist)
               .success(function() {
                   console.log("Successfully created the checklist");
                   $location.path("/manager");
               }).error(function() {
                   console.log("Error creating checklist");
               });
        });
    };
  }).
    directive('checklistInput', function($compile, stateService) {
       return {
           template: '<div class="container" style="margin: 2px; border: ;"><input type="text" ng-model="input.label" style="width: 90%;"></div>',
           replace:true,
           link: function(scope, element) {
               var el = angular.element('<span/>');
               switch(scope.input.inputType) {
                   case 'checkbox':
                       el.append('<input style="margin-left: 5px" type="checkbox" ng-model="input.checked"/>');
                       break;
               }
               $compile(el)(scope);
               element.append(el);
           }
       }
    });
