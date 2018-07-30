// const async = require('async');

// module.exports = function (app, passport, isLoggedIn){
//  app.post('/sign-up', passport.authenticate('local-sign-up', {
//      successRedirect: '/sign-in', // redirect to sign in screen
//      failureRedirect:'/sign-up',// redirect back to sign up 
//      //page if there is an error
//      failureFlash:true // allow flash messages
//  }));
//  app.post('/sign-in', passport.authenticate('local-sign-in', {
//     successRedirect: '/home', // redirect to home page
//     failureRedirect:'/sign-in',// redirect back to sign up 
//     //page if there is an error
//     failureFlash:true // allow flash messages
// }));





// app.get('/email-confirmation/:emailToken', function (req, res){
//     let token = req.params.emailToken;
//     console.log(token);
//     async.waterfall([
//         function (done){
//             User.findOne({'emailConfirmationToken': token },
//                 function(err, user){
//                     req.flash('sign-up-msg', 'No user found');
//                     return res.redirect('/sign-up');
//                 }
                
//                 //set the isEmailConfirmed to true.
//                 user.isEmailConfirmed= true;
//                 user.emailConfirmationToken = undefined;


//                 user.save(function (err){
//                     if (err){
//                         req.flash('sign-up-msg', 'Database error')
//                         return res.redirect('/sign-up');
//                     }
//                     done(err,user);
//                 });
//             }
//         );
//     },
//     function(user, done){
//         let smtpTransport = nodemailer.createTransport({
//             service:'gmail',
//             auth: {
//                 user: 'fviclass@gmail.com',
//                 pass: 'fviclass2017'
//             }
//         });
//         let mailOptions = {
//             to: user.email,
//             from: 'Your email has been confirmed',
//             text: 'Hello,' + user.name + '\n\n'+'This is a confirmation that the email for your account'+ user.email + 'has been confirmed.\n'    
//         };
//         smtpTransport.sendMail(mailOptions);

//         req.flash('sign-in-msg', 'Your email has been confirmed')
//         return res.redirect('/sign-in');
//     } 
//  function(err){
//      if (err) return console.log (err);
//      console.log
 
// }


const asynq = require('async');

const nodemailer = require('nodemailer');

module.exports = function(app,passport,isLoggedIn){
    //passport strategies
    app.post('/sign-up',passport.authenticate('local-sign-up',{
        successRedirect: '/sign-in',
        failureRedirect: '/sign-up',
        failureFlash: true
    }));

    app.post('/sign-in',passport.authenticate('local-sign-in',{
        successRedirect: '/home',
        failureRedirect: '/sign-in',
        failureFlash: true
    }));

    //email confirmation
    app.get('/email-confirmation/:emailToken', function(req,res){
        let token = req.params.email_token;
        console.log(token);
        asynq.waterfall([
            function(done){
                User.findOne({'emailConfirmationToken':token},
                    function(err,user){
                        if(!user){
                            req.flash('sign-up-msg', 'No user found');
                            return res.redirect('/sign-up');
                        }

                        //set the isEmailCOnfirmed to true
                        user.isEmailConfirmed = true;
                        user.emailConfirmationToken = undefined;

                        user.save(function(err){
                            if(err){
                                req.flash('sign-up-msg','Database error')
                                return res.redirect('/sign-up');
                            }
                            done(err,user);
                        });
                    });
            },
            function(user, done){
                let smtpTransport = nodemailer.createTransport({
                    service:'gmail',
                    auth:{
                        user:'fviclass@gmail.com',
                        pass: 'fviclass2018'
                    }
                });
                let mailOptions={
                    to: user.email,
                    from: 'Email Confirmed',
                    subject: 'Your email has been confirmed',
                    text: 'Hello' + user.name + ',\n\n' + 'This is a confirmation that the email for youraccount' + user.email + 'has been confirmed.\n'
                };
                smtpTransport.sendMail(mailOptions);

                req.flash('sign-in-msg','Your email has been confirmed')
                return res.redirect('/sign-in');
            }
        ],function(err){
            if(err) return err;
            console.log('Email confirmed');
        });
    });
}