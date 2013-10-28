var tenThousandServices = angular.module('tenThousandServices',[]);

tenThousandCtrl.factory('dataFactory', ['$http', '$location', function($http,$location) {
    return {
        getData: function(code) {
            console.log("HELLO WORLD");
            var data = $http.get('http://localhost:8033/api?code='+code).success(function(json){
                if (json=='error') {
                    $location.path('/login');
                } else {
                    var img = document.getElementById('loading');
                    img.style.display = 'none';
                    var view = document.getElementById('ng-view');
                    view.style.display = 'block';
                }
            });
            return data;
        }
    }    
}]);
