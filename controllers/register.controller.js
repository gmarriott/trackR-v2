var app = angular.module('app', []);
app.controller('registerCtrl', function($scope, $http) {

  $scope.registerUser = function(user) {
        console.log(user)
        $http.post("/api/authentication/user/register", $scope.user).then(function(response){
          console.log(response)
          $scope.registerSuccess = true;
        })
      };

});