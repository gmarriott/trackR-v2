var app = angular.module('app', []);

app.directive('fileModel', ['$parse', function($parse){
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function(){
				scope.$apply(function(){
					modelSetter(scope, element[0].files[0]);
				})
			})
		}
	}
}]) //Directive for grabbing the image from the file chooser, angular 1 doesnt have a directive for handling files:(

app.controller('accountCtrl', function($scope, $http) {

 var currentUser;

 getUserDetails = function(){
  
 	$http.get("api/authentication/getCurrentUser").then(function(response){
        console.log(response)
  		$scope.currentUser = response.data.currentUser;
		$scope.user = response.data.user;  
		
        currentUser = response.data.currentUser; //gets the current user from the cookie and sets it to the current user.
  	});
 }
 getUserDetails();


	  

	$scope.uploadImage = function(userID, profileImg){

        var fd = new FormData();
        for(var key in profileImg)
            fd.append(key, profileImg[key]);
        $http.put('api/user/'+userID, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(function(response){
            console.log(response)
			getUserDetails();

        })
    //gets the form data from the comment section: text and image and sends it to an endpoint to insert into mongo
  };   
    
  
});