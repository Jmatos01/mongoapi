module.exports = function (app, passport){
 //require the authentication routes
 require('./auth')(app, passport);
 //require the views routes
 require('./views')(app, isLoggedIn);

}


//route middleware to make sure a user is logged in
function isLoggedIn(req, res, next){
    //if user is authenticated in the session, carry on
    if(req.isAuthenticated())
    return next();

    //if tjhey arent redirect them to home page
    res.redirect('/')
 
}