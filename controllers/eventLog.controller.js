var app = angular.module('app', ['ngMap']);

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

app.controller('hubCtrl', function($scope, $http, $location) {

  
  var currentUser;
  
 	$http.get("api/authentication/getCurrentUser").then(function(response){
        console.log(response)
  		$scope.currentUser = response.data.currentUser;
        currentUser = response.data.currentUser; //gets the current user from the cookie and sets it to the current user.
  	});

  var refresh = function(){
  	$http.get("api/post/posts").then(function(response){
        console.log(response.data)
  		$scope.postList = response.data;
  	})
  }

  refresh(); //call function on controller load. Called everytime new post or update on a post takes place

  validatePost = function(result){
      console.log(result)
      $scope.post.lat = result.geometry.location.lat();
      $scope.post.long = result.geometry.location.lng();

       	$http.post("api/post/posts", $scope.post).then(function(response){
  		$scope.post = {};
  		refresh();
  	})

  }

    updatePost = function(result){
      console.log(result)
      let postID = $scope.post._id;
      $scope.post.lat = result.geometry.location.lat();
      $scope.post.long = result.geometry.location.lng();
      
	$http.put("api/post/posts/"+postID, $scope.post).then(function(response){
        $scope.post = {};
  		refresh();
  	})
    //updates the post using the post _id and the new form values

  }


  $scope.addPost = function(post){
   let postcode = $scope.post.location;
   getLatitudeLongitude(validatePost, postcode);

  };

    $scope.addComment = function(comment, postID){
        var fd = new FormData();
        for(var key in comment)
            fd.append(key, comment[key]);
        $http.post('api/post/posts/'+postID, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(function(response){
            refresh();
        })
    //gets the form data from the comment section: text and image and sends it to an endpoint to insert into mongo
  };    
    
    
  $scope.remove = function(id){
  	console.log(id)
  	$http.delete("api/post/posts/"+id).then(function(response){
  		refresh();
  	})
    //function removes a post using a specific post _id
  };
    

  $scope.edit = function(id){
  	console.log(id)
  	$http.get("api/post/posts/"+id).then(function(response){
        console.log(response)
  		$scope.post = response.data[0];

  	})
  };

   $scope.update = function(){
   let postcode = $scope.post.location;
   getLatitudeLongitude(updatePost, postcode);   

  };
    
    $scope.clear = function(){
        $scope.post.title = "";
        $scope.post.desc = "";
        $scope.post.sport = "";
    }
    
    function getLatitudeLongitude(callback, address) {
    // If adress is not supplied, use default value 'Ferrol, Galicia, Spain'
    address = address || 'Ferrol, Galicia, Spain';
    // Initialize the Geocoder
    geocoder = new google.maps.Geocoder();
    if (geocoder) {
        geocoder.geocode({
            'address': address
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                callback(results[0]);
            }
        });
    }
}

});