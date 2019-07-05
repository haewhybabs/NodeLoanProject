# NodeLoanProject For Lendsqr Accessment
    
    
## Installation
follow the following commands to get it started:

* git clone https://github.com/haewhybabs/NodeLoanProject.git
* npm install , to install all the dependencies used in package.json
* start the server with "nodemon"

## Documentation
There are 4 endppoints for the API
* Registration : post request to;   "servername"/users/registration , with name,username,email,password and password2 for the input post

* Login: post request to ; "servername"/users/login , with email and password for the input post
* Get Loans : get request to ; "servername"/loan . The only requirement here is for the user to be logged in before it can be accessed
* Apply for loans: post request to ; "servername"/loan/apply . Here, user needs to login and pass the loanId as the input post.....
**Note ,** it returns false, if user has an active status for the loan

## Author
**Ayobami Babalola**


