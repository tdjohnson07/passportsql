var express= require('express');
var app = express();
var bodyParser=require('body-parser');
var passport = require('passport');
var session = require('express-session');
var localStrategy = require('passport-local');
var mongoose= require('mongoose');
var User = require('./models/user');
var login = require('./routes/login');
var register = require('./routes/register');
var path = require('path');

var mongoURI = "mongodb://localhost:27017/passport_practice";
var mongoDB = mongoose.connect(mongoURI).connection;

mongoDB.on('error', function (err){
  console.log('mongo connection error', err);
});

mongoDB.once('open', function(){
  console.log('connected to mongoDB');
})

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

// passport.use('local', new localStrategy({passReqToCallBack: true, usernameField: 'username'},
//   function(request, username, password, done){
//     User.findOne({username: username}, function(err, user){
//       if (err){
//         console.log('err in localStrategy use', err);
//       };
//       if (!user){
//         return done(null, false, {message:'Incorrect username and password'});
//       }
//       user.comparePassword(passwrod, function(err, isMatch){
//         if (err){
//           console.log('error in comparepassword use', err);
//         }
//         if (isMatch){
//           return done(null, user);
//         }
//         else{
//           done(null, false, {message: 'Incorrect username and Password'});
//         }
//       });
//     });
//   }));
passport.use('local', new localStrategy({
      passReqToCallback : true,
      usernameField: 'username'
  },
  function(req, username, password, done){
    User.findOne({ username: username }, function(err, user) {
      if (err) {
         throw err
      };

      if (!user) {
        return done(null, false, {message: 'Incorrect username and password.'});
      }

      // test a matching password
      user.comparePassword(password, function(err, isMatch) {
        if (err) {
          throw err;
        }

        if (isMatch) {
          return done(null, user);
        } else {
          done(null, false, { message: 'Incorrect username and password.' });
        }
      });
    });
  })
);


var server = app.listen(3000, function(){
  var port = server.address().port;
  console.log('listening on port', port);
});
