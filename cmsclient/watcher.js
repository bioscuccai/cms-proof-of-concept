'use strict';

const crayon = require('crayon');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const mqtt = require('mqtt');
const request = require('request');
const bluebird = require('bluebird');
const mkdirp = bluebird.promisify(require('mkdirp'));
const services = require('./services');
const models = require('./models');
const r=services.r;
/*
r.table("tweets").changes().run()
.then(cursor => {
  cursor.on("data", data=>{
    crayon.error("TWEET");
    console.log("data: ");
    console.log(data);
    if(_.isNull(data.old_val)){
      models.Tweet.create({
        remoteId: data.new_val.id,
        tags: data.new_val.tags,
        text: data.new_val.text,
        user: data.new_val.user
      });
    }
  });
});

r.db("cms1").table("post_photo").outerJoin(r.db("cms1").table("posts"), function(photo, post){
    return photo("post_id").eq(post("id"));
  })
  .pluck({
    left: ["id", "contents"],
    right: ["title", "tags", "updatedAt"]
  }).zip()
  .changes().run()
.then(cursor=>{
  crayon.info("PHOTO");
  cursor.on("data", data=>{
    
  });
});
*/

var processedTokens=[];

var mqttClient  = mqtt.connect({
  host: process.env.MQTT_HOST,
  port: process.env.MQTT_PORT
});

mqttClient.on("connect", ()=>{
  console.log("MQTT client connected");
  process.env.CMS_CLIENT_TAGS.split(",").forEach(tag=>{
    mqttClient.subscribe(`new_post/${tag}`);
    mqttClient.subscribe(`new_photo/${tag}`);
    mqttClient.subscribe(`new_tweet/${tag}`);
  });
});

mqttClient.on("message", (topic, payload) => {
  console.log(topic);
  console.log(payload.toString());
  if(topic.startsWith("new_post")){
    console.log("new post");
    //if(processedTokens.indexOf())
    let postMeta=JSON.parse(payload.toString());
    request.get({
      url: `${process.env.API_SERVER}/api/posts/${postMeta.postId}`,
      json: true
    }, (err, headers, body) => {
      console.log(body);
      models.Post.create({
        title: body.title,
        intro: body.intro,
        text: body.text,
        user: body.user,
        tags: body.tags,
        updatedAt: body.updatedAt,
        remoteId: postMeta.postId
      });
    });
    processedTokens.push(postMeta.publishToken);
  }
  
  if(topic.startsWith("new_photo")){
    console.log("new photo");
    let photoMeta=JSON.parse(payload.toString());
    let downloadDir=path.join("static", "uploads", photoMeta.postId);
    mkdirp(downloadDir)
    .then(()=>{
      let stream=request.get(`${process.env.API_SERVER}/api/photos/${photoMeta.photoId}`)
      .pipe(fs.createWriteStream(
        path.join(downloadDir, photoMeta.fileName)
      ));
      stream.on("finish", ()=>{
        models.Post.findOne({
          remoteId: photoMeta.postId
        }).exec()
        .then(post=>{
          console.log("post");
          post.fileName=photoMeta.fileName;
          post.save();
        });
      });
    });
    processedTokens.push(photoMeta.publishToken);
  }
  
  if(topic.startsWith("new_tweet")){
    console.log("new tweet");
    let tweetMeta=JSON.parse(payload.toString());
    request({
      url: `${process.env.API_SERVER}/api/tweets/${tweetMeta.tweetId}`,
      json: true
    }, (err, headers, body) => {
      models.Tweet.create({
        remoteId: tweetMeta.tweetId,
        user: body.user,
        tags: body.tags,
        text: body.text,
        updatedAt: body.updatedAt
      });
    });
    processedTokens.push(tweetMeta.publishToken);
  }
});

module.exports = {};