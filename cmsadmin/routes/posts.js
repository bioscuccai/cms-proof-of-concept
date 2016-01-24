'use strict';

const express = require('express');
const _ = require('lodash');
const bluebird = require('bluebird');
const fs = bluebird.promisifyAll(require('fs'));
const notifier = require('../notifier');
const services = require('../services');
const r=services.r;

var router=express.Router();
module.exports = router;

router.get('/', (req, res) => {
  r.table("posts").run()
  .then(posts=>{
    console.log(posts);
    res.render("posts/index.jade", {posts});
  });
});

router.get('/new', (req, res) => {
  r.db("cms1").table("posts").map(row=>{
    return row("tags");
  }).distinct().run()
  .then(tags_=>{
    let tags=_.flatten(tags_);
    console.log("tags");
    console.log(tags);
    res.render("posts/new.jade", {tags});
  });
});

router.post('/new', (req, res) => {
  let tags=_.compact(req.body.tags.split(","));
  r.table("posts").insert({
    title: req.body.title,
    intro: req.body.intro,
    text: req.body.text,
    tags: tags,
    user_id: req.user.id,
    createdAt: new Date(),
    updatedAt: new Date()
  }).run()
  .then(post=>{
    notifier.publishPost(tags, post.generated_keys[0]);
    if(!req.files.file.name){
      res.redirect("/posts/new");
    } else {
      fs.readFileAsync(req.files.file.path)
      .then(contents=>{
        return r.table("post_photo").insert({
          post_id: post.generated_keys[0],
          contents: contents,
          filename: req.files.file.name
        });
      })
      .then(photo=>{
        notifier.publishPhoto(tags, photo.generated_keys[0], req.files.file.name, post.generated_keys[0]);
        res.redirect("/posts/new");
      });
    }
  });
});

router.get('/:id/edit', (req, res) => {
  let tags=[];
  r.table("posts").map(row=>{
    return row("tags");
  }).distinct().run()
  .then(tags_=>{
    tags=_.flatten(tags_);
    return r.table("posts").get(req.params.id).run();
  })
  .then(post=>{
    res.render("posts/edit.jade", {
      post: {
        id: post.id,
        title: post.title,
        intro: post.intro,
        text: post.text,
        tags: post.tags.join(",")
      }, tags
    });
  });
});

router.post('/:id/edit', (req, res) => {
  r.table("posts").get(req.params.id)
    .update({
      title: req.body.title,
      intro: req.body.intro,
      text: req.body.text,
      tags: _.compact(req.body.tags.split(",")),
      updatedAt: new Date()
    }).run()
  .then(post=>{
    res.redirect(`/posts/${req.params.id}`);
  });
});

router.get('/:id', (req, res) => {
  r.table("posts").getAll(req.params.id)
    .eqJoin("user_id", r.table("users"))
    .pluck({
    	left: ["id", "title", "intro", "text", "tags"],
    	right: ["id", "name"]
    })
    .map(row=>{
      return row("left").merge({user: row("right")});
    }).nth(0).run()
  .then(post=>{
    res.render("posts/show.jade", {post});
  })
  .catch(e=>{
    res.status(500);
    res.end();
  });
});
