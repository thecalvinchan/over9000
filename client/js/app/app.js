var tenThousand = angular.module('tenThousand',['tenThousandCtrl']);

tenThousand.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {
    $routeProvider.
        when('/login/:status', {
            templateUrl: 'home.html',
            controller: 'homeCtrl'
        }).
        when('/authenticated', {
            templateUrl: 'authenticated.html',
            controller: 'visualizeCtrl'
        }).
        when('/', {
            redirectTo: '/login/auth'
        }).
        otherwise({
            redirectTo: '/login/autherror'
        });
    $locationProvider.html5Mode(true);
}]);
