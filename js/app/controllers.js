var tenThousandControllers = angular.module('tenThousandControllers',[]);

tenThousandControllers.controller('home', ['$scope', '$routeParams',
    function home($scope) {
        $scope.status = $routeParams.status == 'autherror' ? 'Please Login to Continue.' : '';
    }
]);

tenThousandControllers.controller('visualize',['$scope','$http','$routeParams',
    function($scope,$http,$routeParams) {
        if ($routeParams
    }
]);

