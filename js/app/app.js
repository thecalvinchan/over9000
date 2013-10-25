var tenThousand = angular.module('tenThousand', [
    'ngRoute',
    'tenThousandControllers'
]);

tenThousand.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/login', {
                templateURL: 'home.html'
                controller: 'home'
            }).
            when('/authenticated', {
                templateURL: 'authenticated.html',
                controller: 'visualize'
            }).
            otherwise({
                redirectTo: '/login'
            });
    }
]);
