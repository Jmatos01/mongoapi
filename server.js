const port = process.env.PORT || 8899;
const express = require('express');
const app = express();
const session = require('express-session');
const flash =require('connect-flash');
const passport = require('passport');
const database = require('./database')();

//parses the body, very important
app.use(express.urlencoded({ extended:true}));
app.use(express.json());

require('./app/passport')(passport);

app.set('view engine', 'ejs'); 

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8899' + port);
  
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
  
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
  
    // Pass to next layer of middleware
    next();
  });

  //required for passport
  app.set('trust proxy', 1); 

  //required for session
  app.use(session({
      secret: 'secretsecretsecret',
      resave: false,
      saveUninitialized: true,
      cookie: {
          secure: false
      }
  }));

  //required for Flash 
  app.use(flash());

  app.use(passport.initialize());
  app.use(passport.session());

  //expose our assets (css, js, images, etc )
  app.use("/", express.static(__dirname + "/assets"));//__dirname is a node method? expose whatever is in the folder "/assets" in the directoy "/"

 require('./app/routes')(app,passport);

 app.listen(port,function(err){
   if(err)console.log('error',err);

   console.log("Server listening on port" + port);
});