'use strict';

const express = require('express');
const _ = require('lodash');
const services = require('../services');
const notifier = require('../notifier');

const r=services.r;

var router=express.Router();
module.exports = router;

router.get('/', (req, res) => {
  r.table("tweets")
    .eqJoin("user_id", r.table("users"))
    .pluck({
      left: ["id", "text"],
      right: ["name", "id"]
    })
    .map(row=>{
      return row("left").merge({user: row("right")});
    })
    .run()
  .then(tweets=>{
    res.render("tweets/index.jade", {tweets});
  });
});

router.get('/new', (req, res) => {
  res.render("tweets/new.jade");
});

router.post('/new', (req, res) => {
  let tags=req.body.tags.split(",");
  services.r.table("tweets").insert({
    text: req.body.text,
    user_id: req.user.id,
    tags: tags,
    createdAt: new Date(),
    updatedAt: new Date()
  }).run()
  .then(tweet=>{
    notifier.publishTweet(tags, tweet.generated_keys[0]);
    res.render("tweets/new.jade");
  });
});

router.get('/edit', (req, res) => {
  res.render("tweets/edit.jade");
});

router.post('/edit', (req, res) => {
  res.render("tweets/edit.jade");
});

router.get('/:id', (req, res) => {
  services.r.table("tweets").get(req.params.id).run()
  .then(tweet=>{
    res.render("tweets/show.jade", {tweet});
  });
});
