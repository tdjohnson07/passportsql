var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var Users = require('../models/user');

router.get('/', function(request, response){
  response.sendFile(path.resolve(__dirname, '../public/views/register.html'));
});

router.post('/', function(request, response){
  Users.CreateUser(request.body.username, request.body.password, function(err){
    if (err){
      console.log('create post err', err);
      response.sendStatus(500);
    }
    else {
      response.redirect('/');
    }
  })
});

module.exports = router;
