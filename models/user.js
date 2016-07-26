var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt=require('bcrypt');

var UserSchema = new Schema({
  username: {type: String, required: true, index: {unique: true}},
  password: {type: String, required: true}
});

UserSchema.pre('save', function(next){
  var user = this;

  if(!user.isModified('password')){
    return next();
  };
  bcrypt.hash(user.password, 10, function(err, hash){
    if(err){
      console.log('bcrypt error', err);
    }
    console.log('hashed password', hash);
    user.password = hash;
    return next();
  });
});
UserSchema.methods.comparePassword = function(canidatePassword ,cb){
    var user = this;
    console.log('password now', user.password);
    bcrypt.compare(canidatePassword, user.password, function(err, isMatch){
      if(err){
        console.log(err);
      }
      else{
        console.log('isMatch', isMatch);
        cb(null, isMatch);
      }
});
};

module.exports= mongoose.model('User', UserSchema);
