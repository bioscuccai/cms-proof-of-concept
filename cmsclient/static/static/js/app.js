var app = angular.module('app', ['ngMaterial', 'ui.router', 'btford.socket-io']);

app.value("GlobalSettings", {
  API: "http://localhost:3000"
});

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");
  
  $stateProvider.state("default", {
    url: '/',
    views: {
      main: {
        controller: 'HomeCtrl',
        templateUrl: 'templates/home.html',
        resolve: {
          posts: function(PostFactory){
            return PostFactory.mainPosts();
          }
        }
      },
      tweets: {
        controller: 'TweetCtrl',
        templateUrl: 'templates/tweets.html',
        resolve: {
          tweets: function(TweetFactory){
            console.log("tweets");
            return TweetFactory.mainTweets();
          }
        }
      }
    }
  });
  
  $stateProvider.state("post", {
    url: '/post/:id',
    params: {id: null},
    views: {
      main: {
        controller: 'PostCtrl',
        templateUrl: 'templates/post.html',
        resolve: {
          post: function(PostFactory, $stateParams){
            console.log("query");
            return PostFactory.post($stateParams.id);
          }
        }
      }
    }
  });
});
