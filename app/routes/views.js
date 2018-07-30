module.exports = function(app, isLoggedIn) {

  app.get('/', function(req, res) {
    if (req.isAuthenticated) {
      res.redirect('/home.ejs');
    } else {
      res.redirect('/signin.ejs');
    }
  });

  app.get('/home', isLoggedIn, function(req, res) {
    res.render('home.ejs');
  });
  app.get('/password-recovery', function(req, res) {
    res.render('password_recovery.ejs');
  });
  app.get('/password-reset', function(req, res) {
    res.render('password_reset.ejs');
  });
  app.get('/profile', function(req, res, isLoggedIn) {
    res.render('profile.ejs');
  });
  app.get('/sign-in', function(req, res) {
    res.render('signin.ejs', {
      message: req.flash('sign-in-msg')
    });
  });
  app.get('/sign-up', function(req, res) {
    res.render('signup.ejs');
  });
  app.get('/update-profile', function(req, res, isLoggedIn) {
    res.render('update_profile.ejs');
  });
  app.get('*', function(req, res) {
    res.render('404.ejs');
  });
};
