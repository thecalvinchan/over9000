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
    //$scope.data = {data:{totalAdditions:159988,totalDeletions:38576,totalCommits:338,earliestWeek: 1302393600, latestWeek: 1382832000}};
    $scope.data = data.getData($scope.code);
    $scope.unit = 100;
    console.log(typeof $scope.data);
    $scope.calcNum = function(num,prec) {
        return num.toFixed(prec);
    };
    $scope.roundFloat = function(num,prec) {
        if (num < 0) {
            return 0;
        } else {
            return num.toFixed(prec);
        }
    };
    $scope.displayTime= function(num) {
        if (num < 0) {
            return 0;
        } else {
            var whole = Math.floor(num);
            var decimal = (num - whole).toFixed(4);
            var temp = Math.floor(decimal*100);
            var minutes = (temp/100*60).toFixed(0);
            var seconds = ((decimal - temp/100)*60).toFixed(0);
            if (minutes<10) {
                minutes = "0"+minutes;
            }
            if (seconds<10) {
                seconds = "0"+seconds;
            }
            return whole+':'+minutes+':'+seconds;
        }
    };
    $scope.graphHours = function(num) {
        if (num > 100) {
            return 100;
        } else {
            return Math.floor(num);
        }
    }
}]);
