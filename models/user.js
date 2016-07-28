var pg = require('pg');
var bcrypt=require('bcrypt');

var config = {
  database: 'passport',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000
};
var pool = new pg.Pool(config);

function CreateUser(username, password, callback){
  bcrypt.hash(password, 10, function(err, hash){
    pool.connect(function(err, client, done){
      if(err){
        console.log('creat user error', err);
        done();
        return callback(err);
      }
      client.query('INSERT INTO users (username, password) VALUES ($1, $2)',
      [username, hash], function(err, result){
      if(err){
        console.log('insert error', err);
        done();
        return callback(err);
      }
      callback(null);
    })
    })
  })
}

function findByUsername(username, callback){
  pool.connect(function(err, client, done){
    if (err){
      console.log('connection error', err);
      done();
      return callback(err);
    }
    client.query('SELECT * FROM users WHERE username=$1',[username], function(err, result){
      if (err){
        done();
        return callback(err);
      }
      else{
        callback(null, result.rows[0]);
      }
    });
  });
}

function findById(id, callback){
  pool.connect(function(err, client, done){
    if(err){
      console.log('connection error', err);
      done();
      return callback(err);
    }
    client.query('SELECT * FROM users WHERE id=$1',[id],function(err, result){
        if(err){
          console.log('id query error', err);
          done();
          return callback(err);
        }
        callback(null, result.rows[0]);
    })
  })
}
function findAndComparePassword(username, canidatePassword, callback){
  findByUsername(username, function(err, user){
    if (err){
      return callback(err)
    }
    if (!user){
      return callback(null, false)
    }
    bcrypt.compare(canidatePassword, user.password, function(err, isMatch){
      if(err){
        console.log(err);
        callback(err);
      }
      else{
        console.log('isMatch', isMatch);
        callback(null, isMatch, user);
      }
    })
  })
}


module.exports= {
  findByUsername: findByUsername,
  findById: findById,
  findAndComparePassword: findAndComparePassword,
  CreateUser: CreateUser
};
