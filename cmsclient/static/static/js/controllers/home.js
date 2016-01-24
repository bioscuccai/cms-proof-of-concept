app.controller("HomeCtrl", function($scope, posts){
  $scope.posts=posts;
  console.log("posts:");
  console.log(posts);
  console.log("home ctrl");
});
