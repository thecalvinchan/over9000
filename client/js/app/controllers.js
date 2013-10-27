var tenThousandCtrl = angular.module('tenThousandCtrl',['tenThousandServices']);
    
tenThousandCtrl.controller('homeCtrl', ['$scope', '$routeParams',
    function ($scope,$routeParams) {
        $scope.status = $routeParams.status == 'autherror' ? 'Please Login to Continue.' : '';
        $scope.user = '';
    }
]);
    
tenThousandCtrl.controller('visualizeCtrl',['$scope','$http','$routeParams','$location','dataFactory', function($scope,$http,$routeParams,$location,data) {
    if (!$routeParams.attempt) {
        $location.path('/login/autherror');
    } else {
        $scope.code = $routeParams.code;
    }
    console.log($scope.code);
    $scope.data = data.getData($scope.code);
    console.log($scope.data);
}]);
