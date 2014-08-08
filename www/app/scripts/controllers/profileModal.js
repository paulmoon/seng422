var ProfileModalInstanceCtrl = function ($scope, $modalInstance, items) {

  $scope.profileInfo = items;

  $scope.p = {};
  $scope.p.password = "";

  $scope.ok = function () {
    if($scope.p.password != "") {
      $scope.profileInfo.password = $scope.p.password;
    }
    $modalInstance.close($scope.profileInfo);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};
