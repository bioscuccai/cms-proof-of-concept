'use strict';

const dotenv = require('dotenv').load();
const express = require('express');
const formidable = require('formidable');
const morgan = require('morgan');
const serveStatic=require("serve-static");
const flash = require('connect-flash');
const session=require("express-session");
const cookieParser = require('cookie-parser');
const crayon = require('crayon');
const passport = require('passport');
const RedisStore=require("connect-redis")(session);
const _ = require('lodash');

var auth = require('./auth');

crayon.verbose=true;

var app=express();
app.set("view engine", "jade");
app.set("views", "./templates");
app.use(serveStatic(__dirname+"/static"));
app.use(morgan('dev', {
  skip: (req, res) => {
    return req.url.startsWith("/static");
  },
  immediate: true
}));

app.use(cookieParser("060782a86237546ea0a8828a474642d3024becb7d3ed21e8fa"));
app.use(session({
  secret: "008a0701e21f1ec888b1e0e888b3510b4b50324c34e04f6723",
  store: new RedisStore(),
  resave: false,
  saveUninitialized: false}));
app.use(flash());

app.use((req, res, next) => {
  let form=new formidable.IncomingForm();
  form.keepExtensions=true;
  form.multiples=true;
  form.parse(req, (err, fields, files) => {
    req.body=fields;
    req.files=files;
  });
  form.on('end', ()=>{
    next();
  });
});
app.use(passport.initialize());
app.use(passport.session());
passport.use(auth.strategy);
passport.serializeUser(auth.userSerializer);
passport.deserializeUser(auth.userDeserializer);

app.use((req, res, next) => {
  console.log("user:");
  console.log(req.user);
  res.locals.user=req.user;
  next();
});

var routeIndex = require('./routes/index');
var routePosts = require('./routes/posts');
var routeUsers = require('./routes/users');
var routeTweets = require('./routes/tweets');
var routeApi = require('./routes/api');

app.use("/", routeIndex);
app.use("/posts", routePosts);
app.use("/users", routeUsers);
app.use("/tweets", routeTweets);
app.use("/api", routeApi);

app.listen(process.env.PORT||5678);
