var express = require("express");
var bodyParser = require("body-parser");
var expressValidator = require("express-validator");
var session = require("express-session");
var passport = require("passport");
var localStrategy = require("passport-local").Strategy;
var bcrypt = require("bcryptjs");
var cookieParser = require('cookie-parser');
var userRouter = require("./api/users");
var indexRouter = require("./api/index");
var loanRouter = require("./api/loan");
// var Datastore = require("nedb"),
//   db = new Datastore({ filename: "user_db", autoload: true });
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Handle express Sessions
app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    resave: true
  })
);

app.use(cookieParser());

//Passport

app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.initialize());
app.use(passport.session());
//validator
app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

app.use(
  expressValidator({
    customValidators: {
      emailExist(email) {
        return new Promise((resolve, reject) => {
          db.findOne({ email: email }, (err, user) => {
            if (err) throw err;
            if (user == null) {
              resolve();
            } else {
              reject();
            }
          });
        });
      }
    }
  })
);

//Routing

app.use("/users", userRouter);
app.use("/", indexRouter);
app.use("/loan", loanRouter);

port = 8000;
app.listen(port, function() {
  console.log("server started on port :" + port);
});

module.exports = app;
