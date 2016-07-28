var express= require('express');
var app = express();
var bodyParser=require('body-parser');
var passport = require('passport');
var session = require('express-session');
var localStrategy = require('passport-local');
var User = require('./models/user');
var login = require('./routes/login');
var register = require('./routes/register');
var path = require('path');


app.use(session({
  secret: 'secret',
  key: 'user',
  resave: true,
  saveUninitialized: false,
  cookie: {maxAge: 600000, secure: false}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static('public'));
app.use('/register', register);
app.use('/login', login);
app.get('/', function(request, response){
  response.sendFile(path.resolve(__dirname, 'public/views/login.html'))
});

passport.serializeUser(function(user, done){
  done(null, user.id);
});
passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    if (err){
      return done(err)
    }
    done(null, user);
  });
});

passport.use('local', new localStrategy({
      usernameField: 'username',
      passwordField: 'password'
  },
  function(username, password, done){
    User.findAndComparePassword(username, password, function(err, isMatch, user) {
      if (err) {
         throw err
      };
      if (!user) {
        return done(null, false);
      }
      if(isMatch){
        return done(null, user);
      }
      else{
        done(null, false);
      }
    });
  })
);


var server = app.listen(3000, function(){
  var port = server.address().port;
  console.log('listening on port', port);
});
