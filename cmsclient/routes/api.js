'use strict';

var express = require('express');
var _ = require('lodash');
var models = require('../models');

var router=express.Router();
module.exports = router;

router.get('/', (req, res) => {
  res.render("api/index.jade");
});

router.get("/posts", (req, res) => {
  models.Post.find().sort('-updatedAt').exec()
  .then(posts=>{
    res.json(posts);
  });
});

router.get("/tweets", (req, res) => {
  models.Tweet.find().exec()
  .then(tweets=>{
    res.json(tweets);
  });
});
