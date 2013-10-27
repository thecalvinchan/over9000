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
    $scope.data = {data:{totalAdditions:159988,totalDeletions:38576,totalCommits:338,earliestWeek: 1302393600, latestWeek: 1382832000}};
    //$scope.data = data.getData($scope.code);
    $scope.unit = 100;
    console.log(typeof $scope.data);
}]);
