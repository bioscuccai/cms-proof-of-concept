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

var watcher = require('./watcher');
var websockets = require('./websockets');
crayon.verbose=true;

var app=express();
var http=require("http").Server(app);
websockets.setup(http);
app.set("view engine", "jade");
app.set("views", "./templates");
app.use(serveStatic(__dirname+"/static"));
app.use(morgan('dev', {
  skip: (req, res) => {
    return req.url.startsWith("/static");
  },
  immediate: true
}));

app.use(cookieParser("56a4e08d31d3346e95f64c1277aa6081abff9a1d7721a37c36"));
app.use(session({secret: "0078cd3848c089b5be2b41890525f20e455b2d1ab7d7c103a0", resave: false, saveUninitialized: false}));
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
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(auth.strategy);
// passport.serializeUser(auth.userSerializer);
// passport.deserializeUser(auth.userDeserializer);


var routeApi = require('./routes/api');

app.use("/api", routeApi);

http.listen(process.env.PORT||3000);
