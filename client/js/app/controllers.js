var tenThousandCtrl = angular.module('tenThousandCtrl',['tenThousandServices']);
    
tenThousandCtrl.controller('homeCtrl', ['$scope', '$routeParams',
    function ($scope,$routeParams) {
        $scope.status = $routeParams.status == 'autherror' ? 'Please Login to Continue.' : '';
        $scope.user = '';
    }
]);
    
tenThousandCtrl.controller('visualizeCtrl',['$scope','$http','$routeParams','$location','$timeout','dataFactory', function($scope,$http,$routeParams,$location,$timeout,data) {
    if (!$routeParams.attempt) {
        $location.path('/login/autherror');
    } else {
        $scope.code = $routeParams.code;
    }

    var timeout;
    $scope.messages = [];
    $scope.data = data.getData($scope.code).success(timeoutFn);
    $scope.unit = 100;

    function timeoutFn(res) {
        var date = new Date(res.time);
        date = date.toLocaleString();
        if (res.gitCache) {
            $scope.messages.push(type:"alert",message:"GitHub has not finished compiling your stats. This page will update every two minutes as your stats are being compiled."});
            timeout = $timeout(function() {
                $scope.data = data.getData($scope.code).success(timeoutFn);
            },120000);
            $scope.lastFetch = "Last Attempted Update: " + date;
        } else {
            $scope.lastFetch = "Last Updated: " + date;
        }
    };

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
