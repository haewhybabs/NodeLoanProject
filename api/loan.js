var express = require("express");
var router = express.Router();
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


// store as json file for db
var Datastore = require("nedb"),
//loan table
Loans = new Datastore({ filename: "./loan", autoload: true });
//loan summary table
loanSummary=new Datastore({filename: "./loan_summary",autoload:true});


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

router.post('/apply',ensureAuthenticated,function(req,res,next){

    var loanId=req.body.loanId;
    var userId=req.user[0]._id;
    var loanRequest={
        userId:userId,
        loanId:loanId,
        loanStatus:1,
        loanPaymentComplete:0,
    };
    /*
        #loanId is a foreign key in loan_summary table from Loans table
        it then comes with ;

        *loan duration
        *amount
        *tenure

        #loanStatus is either;

        *1:active
        *0:inactive

        #check the loanSummary table to with the userId and loanId, if the loanActive is active, then it should not allow user to take the loan
    */
   
   loanSummary.findOne({ $and : [{userId:userId},{loanId:loanId},{loanStatus:1}]},function(err,userLoan){
        if(err){throw err }
        if(!userLoan){
            loanSummary.insert(loanRequest,function(err,request){
                if(err){throw err}
                res.status(200).json({
                    status:true,
                    message:"You application is successful"
                });
            });
        }
        else{
            res.status(200).json({
                status:false,
                message:"You have an active loan currently running"
            });
        }
   });

});

module.exports = router;