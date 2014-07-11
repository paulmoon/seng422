'use strict';

angular.module('angWeatherAppApp')
  .controller('MainCtrl', function ($scope) {
    $scope.actives = [
      { title: "Forests Report", content: "Some report about forests"},
      { title: "Norwhales Report", content: "motherfucking nowhales!!!!"}
    ];

    $scope.finished = [
      { title: "Finsihed stuff", content: "got some stuff finished"}
    ];
  });
