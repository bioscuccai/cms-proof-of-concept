"use strict";

var passport = require('passport');
var LocalStrategy=require("passport-local").Strategy;
var formidable = require('formidable');
var crayon = require('crayon');
var sha1 = require('sha1');
var acl = require('acl');

var services = require('./services');

function currentUser(req, res){
  return req.user;
}

function auth(){
  
}

function userSerializer(user, done){
  done(null, user.id);
}

function userDeserializer(userId, done){
  services.r.table("users").get(userId).run()
  .then(user=>{
    done(null, user);
  });
}

var strategy=new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  (email, password, done)=>{
    services.r.table("users").filter({
      email,
      password: sha1(password)
    }).run()
    .then(users=>{
      if(users.length>0){
        done(null, users[0]);
      } else {
        done(null, false);
      }
    });
  }
);



module.exports = {
  auth,
  strategy,
  userSerializer,
  userDeserializer
};