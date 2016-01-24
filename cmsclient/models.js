'use strict';

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var bluebird = require('bluebird');

mongoose.Promise=bluebird;
mongoose.connect(process.env.MONGO_ENV_URI || "mongodb://localhost:27017/test");
mongoose.plugin(mongoosePaginate);

var postSchema=mongoose.Schema({
  remoteId: String,
  title: String,
  intro: String,
  text: String,
  tags: Array,
  fileName: String,
  user: mongoose.Schema.Types.Mixed,
  updatedAt: Date
});

var Post=mongoose.model('Post', postSchema);
  
var tweetSchema=mongoose.Schema({
  remoteId: String,
  text: String,
  tags: Array,
  user: mongoose.Schema.Types.Mixed,
  updatedAt: Date
});

var Tweet=mongoose.model('Tweet', tweetSchema);

var categorySchema=mongoose.Schema({
});

var Category=mongoose.model('Category', categorySchema);


module.exports = {
  Post, Tweet, Category
};
