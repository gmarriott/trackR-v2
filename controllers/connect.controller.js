var app = angular.module('app', []);
app.controller('connectCtrl', function($scope, $http) {

 var currentUser;
  
 	$http.get("api/authentication/getCurrentUser").then(function(response){
        console.log(response)
  		$scope.currentUser = response.data.currentUser;
        currentUser = response.data.currentUser; //gets the current user from the cookie and sets it to the current user.
  	});
    
    
  $http.get("api/user/allUsers").then(function(response) {
    $scope.users = response.data;
    console.log($scope.users)
  });
  
});