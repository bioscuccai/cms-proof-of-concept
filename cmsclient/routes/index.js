'use strict';

var express = require('express');
var _ = require('lodash');
var models = require('../models');

var router=express.Router();
module.exports = router;

router.get('/', (req, res) => {
  models.Post.find().exec()
  .then(posts=>{
    res.render("index.jade", {posts});
  });
});
