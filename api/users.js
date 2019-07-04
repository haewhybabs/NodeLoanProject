var express = require("express");
var router = express.Router();
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


// store as json file for db
var Datastore = require("nedb"),
db = new Datastore({ filename: "./user_db", autoload: true });

var bcrypt= require('bcryptjs');

function emailExist(email) {
  db.findOne({ email: email }),(function (err, user){
    console.log(user);
  });

}


router.post("/registration", function(req, res, next) {
  //Get Form Values
  var name = req.body.name;
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var password2 = req.body.password2;

  //Form Validation
  req.checkBody("name", "Name field is required").notEmpty();
  
  req.checkBody("email", "Email field is not valid").isEmail();
  req.checkBody("username", "Username field is required").notEmpty();
  req.checkBody("password", "Password field is required").notEmpty();
  req.checkBody("password2", "Password do not match").equals(req.body.password);
 

  //Check for errors
  var errors = req.validationErrors();
  if (errors) {
      res.status(200).json({
        message:"Please fill all the fields",
        status:false,
        errors:errors,
        
      });  
  
  } 
  //Requirements are met
  else {
    var newUser = {
      name: name,
      email: email,
      username: username,
      password: password
    };

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        db.insert(newUser, function(err, user) {
          if (err) throw err;

          res.status(200).json({
            status:true,
            message:"User registration is successful",
      
          });
        });
      });
    });    
  }
 
  
});

router.post('/login',
  passport.authenticate('local'), function(req,res){

    res.status(200).json({
      status:true,
      message:"You have successfully logged in",
      user:req.user
    });
});

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  db.find({_id:id}, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    db.findOne({ email: email }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      bcrypt.compare(password, user.password, function(err, isMatch) {
        console.log(user);
        console.log(password);

        if (err) { return done(err); }
        if(isMatch){
          return done(null, user);
        } else{

          return done(null, false, {message:'Invalid Password'});
        }
      });
      // if (!user.validPassword(password)) {
      //   return done(null, false, { message: 'Incorrect password.' });
      // }

      // return done(null, user);
    });
  }
));
module.exports = router;
