var express = require("express");
var router = express.Router();

// store as json file for db
var Datastore = require("nedb"),
db = new Datastore({ filename: "./user_db", autoload: true });

var bcrypt= require('bcryptjs');


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
  var emailExist=function (email) {
    db.findOne({ email: email }, (err, user) => {
      if (err) throw err;
      if (user == null) {
        return false
      } else {
        return true;
      }
    });

  }

  //Check for errors
  var errors = req.validationErrors();
  if (errors || emailExist) {
    if(errors){
      res.status(200).json({
        message:"Please fill all the fields",
        status:false,
        errors:errors
      });
    }
    else{
      res.status(200).json({
        message:"Email is already existing",
        status:false
      });
    }
  //Requirements are met
  } else {
    var newUser = {
      name: name,
      email: email,
      username: username,
      password: password
    };

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        db.insert(newUser, function(err, newUser) {
          if (err) throw err;
        });
      });
    });

    res.status(200).json({
      status:true,
      message:"User registration is successful"
    });
  }

  
});

module.exports = router;
