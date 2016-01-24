'use strict';

const express = require('express');
const _ = require('lodash');
const sha1 = require('sha1');
const services = require('../services');
const passport = require('passport');

var router=express.Router();
module.exports = router;

router.get('/', (req, res) => {
  console.log(req.user);
  services.r.table("users").run()
  .then(users=>{
    res.render("users/index.jade", {users});
  });
});

router.get('/new', (req, res) => {
  res.render("users/new.jade");
});

router.post('/new', (req, res) => {
  services.r.table("users").insert({
    name: req.body.name,
    email: req.body.email,
    password: sha1(req.body.password),
    roles: []
  }).run()
  .then(user=>{
    res.render("users/new.jade");
  });
});

router.get('/edit', (req, res) => {
  res.render("users/edit.jade");
});

router.post('/edit', (req, res) => {
  res.render("users/edit.jade");
});

router.get("/login", (req, res) => {
  res.render("users/login.jade");
});

router.post("/login", passport.authenticate('local',  {failureRedirect: "/", failureFlash: "Invalid login"}), (req, res) => {
  console.log("logged in");
  console.log(req.user);
  res.redirect("/users/login");
});

router.get("/logout", (req, res)=>{
  req.logout();
  res.send("");
});

router.get('/:id', (req, res) => {
  services.r.table("users").get(req.params.id).run()
  .then(user=>{
    res.render("users/show.jade", {user});
  });
});

