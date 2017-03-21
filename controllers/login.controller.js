var app = angular.module('app', ['ngCookies']);
app.controller('loginCtrl', function($rootScope, $scope, $http, $location, $cookies, $window, $templateCache) {

  var host  = location.host;
    
//  $scope.header = {name: "header.html", url: "includes/header.html"};


  $scope.validateUser = function(user) {
        $http.post("api/authentication/user/login", $scope.user).then(function(response){
          
          console.log(response.data.token)
          $cookies.put('token', response.data.token)
          $cookies.put('currentUser', response.data.currentUser)
          $rootScope.token = response.data.token;
          $rootScope.currentUser = response.data.currentUser;
          $window.location.href = '/eventLog';
            
        },
        function (err) {
            console.error(JSON.stringify(err));
            $scope.validationError = true;
        });
        
      };

});