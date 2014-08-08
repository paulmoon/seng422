var ProfileModalInstanceCtrl = function ($scope, $modalInstance, items) {

  $scope.profileInfo = items;

  $scope.ok = function () {
    $modalInstance.close($scope.profileInfo);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};
