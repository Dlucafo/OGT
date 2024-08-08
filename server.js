const express = require('express');
const app = express();
const path = require('path');
const router = require('./routes/routes.js');
let passport = require('./secure/passport.js').passport;
let bcrypt = require('bcrypt');
var csrf = require('@dr.pogodin/csurf');
var expressSession = require('express-session');

const port = 8090;

passport.setBcrypt(bcrypt);

const csrfProtection = csrf({ cookie: true });
const cookieParser = require('cookie-parser');

app.set('trust proxy', 1);

app.use('/static', express.static(__dirname + '/static'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "static/views"));
app.use('/v1.0/app/', router);
app.use(cookieParser('lamiatesi-secret-key-for-me'));
app.use(expressSession({
  secret: 'lamiatesi-secret-key-for-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: false,
    secure: false,
    sameSite: 'strict',
  }
}))
app.use(express.json({limit: '50mb', parameterLimit: 1000000}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));

app.use(passport.initialize());
app.use(passport.session());


app.get('/', csrfProtection, function(req, res) {
  res.render('login', {csrfToken: req.csrfToken()});
})

app.post('/login', csrfProtection, function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { console.log(err); return next(err); }
    if (!user) { console.log(user); return res.redirect('/'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      userGlobal = user;
      return res.redirect('/views');
    });
  })(req, res, next);
});

app.use('/v1.0', function (req, res, next) {
  if(req.user) {
    if(req.headers.authorization===req.user.id) {
      next();
    } else {
      console.log('authorization: false');
      res.status(401).json({authorization: false});
      //next();
    }
  } else {
    console.log('authentication: false');
    res.status(403).json({authentication: false});
  }
});

app.get('/views', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render('views', {user:req.user.id, codice_fiscale: req.user.codice_fiscale});
    next();
  } else {
    console.log('Utente non autenticato');
    res.redirect("/");
  }
})

app.use('/', router);

router.use('/', function (req, res, next) {
  console.log(req.user.id)
  console.log('Time: ', new Date);
  next();
});

app.listen(port);

console.log("Server is listening on port " + port);

