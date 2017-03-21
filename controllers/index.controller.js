var app = angular.module('app', []);
app.controller('indexCtrl', function($scope, $http, $templateCache) {
    
    $scope.header = {name: "header.html", url: "includes/header.html"};
    $templateCache.put("header.html", "includes/header.html");
    //places the header into template cache to improve load times
    
});