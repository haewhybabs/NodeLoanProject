var express = require("express");
var router = express.Router();
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


// store as json file for db
var Datastore = require("nedb"),
Loans = new Datastore({ filename: "./loan", autoload: true });
LoanSummary=new Datastore({filename: "./loan_summary",autoload:true});


router.get('/',ensureAuthenticated,function(req,res,next){

    Loans.find({}, function (err, loan) {
        res.status(200).json({
            status:true,
            loan:loan
        });
    });
    
});


function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
      return next();
    }
    res.status(200).json({
        status:false,
        message:"You are not authorized",
    });
}



module.exports = router;