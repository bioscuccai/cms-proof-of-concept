'use strict';

var mosca = require('mosca');
var uuid = require('node-uuid');

var moscaServer = new mosca.Server({
  port: parseInt(process.env.MQTT_PORT)
//  backend: pubsubsettings
});

function publishPost(tags, postId){
  let publishToken=uuid.v4();
  tags.forEach(tag=>{
    moscaServer.publish({
      topic: `new_post/${tag}`,
      payload: JSON.stringify({
        publishToken: publishToken,
        postId: postId
      })
    });
  });
}

function publishTweet(tags, tweetId){
  let publishToken=uuid.v4();
  tags.forEach(tag=>{
    moscaServer.publish({
      topic: `new_tweet/${tag}`,
      payload: JSON.stringify({
        publishToken: publishToken,
        tweetId: tweetId
      })
    });
  });
}

function publishPhoto(tags, photoId, fileName, postId){
  let publishToken=uuid.v4();
  tags.forEach(tag=>{
    moscaServer.publish({
      topic: `new_photo/${tag}`,
      payload: JSON.stringify({
        publishToken: publishToken,
        photoId: photoId,
        fileName: fileName,
        postId: postId
      }) //payload
    }); //publish
  }); //foreach
}

module.exports = {
  publishPost,
  publishTweet,
  publishPhoto
};