'use strict';

var express = require('express');
var _ = require('lodash');
var models = require('../models');
var services = require('../services');
const r=services.r;

var router=express.Router();
module.exports = router;

router.get('/', (req, res) => {
  res.render("api/index.jade");
});


router.get("/posts/:id", (req, res) => {
  r.table("posts").getAll(req.params.id)
    .eqJoin("user_id", r.table("users"))
    .pluck({
    	left: ["id", "title", "intro", "text", "tags", "updatedAt"],
    	right: ["id", "name"]
    })
    .map(row=>{
      return row("left").merge({user: row("right")});
    }).nth(0).run()
  .then(post=>{
    res.json(post);
  })
  .catch((e)=>{
    console.log(e);
    res.json({status: "error"});
  });
});

router.get("/tweets/:id", (req, res) => {
  r.table("tweets")
    .eqJoin("user_id", r.table("users"))
    .pluck({
      left: ["id", "text", "tags", "updatedAt"],
      right: ["name", "id"]
    })
    .map(row=>{
      return row("left").merge({user: row("right")});
    })
    .nth(0).run()
  .then(tweet=>{
    res.json(tweet);
  })
  .catch(e=>{
    res.json({status: "error"});
  });
});

router.get("/photos/:id", (req, res) => {
  r.table("post_photo").get(req.params.id).run()
  .then(photo=>{
    res.write(photo.contents);
    res.end();
  });
});
