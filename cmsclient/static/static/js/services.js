app.factory("TweetFactory", function($http, GlobalSettings, WsFactory){
  function mainTweets(){
    console.log("querying");
    return $http.get(GlobalSettings.API+"/api/tweets")
    .then(function(data){
      console.log("returned");
      console.log(data.data);
      return data.data;
    });
  }
  
  return {
    mainTweets: mainTweets
  };
});

app.factory("PostFactory", function($http, GlobalSettings){
  function mainPosts(){
    console.log("querying");
    return $http.get(GlobalSettings.API+"/api/posts")
    .then(function(data){
      return data.data;
    });
  }
  
  function post(id){
    return $http.get(GlobalSettings.API+"/api/posts/"+id)
    .then(function(data){
      return data.data;
    });
  }
  
  return {
    mainPosts: mainPosts,
    post: post
  };
});

app.factory('WsFactory', function(socketFactory){
  var ioSocket = io.connect('ws://localhost:3000');
  return socketFactory({ioSocket: ioSocket});
});
