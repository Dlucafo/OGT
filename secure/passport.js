let {db} = require('../db/dbConnection.js');
var User = require('./user');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

passport.setBcrypt = function(bcrypt) {
  passport.bcrypt = bcrypt;
}

passport.use(new LocalStrategy(
  function(username, password, done) {
    db.one('SELECT p.id, u.hashed_password FROM persone AS p INNER JOIN users AS u ON p.id=u.idpersona WHERE p.codice_fiscale=$1', [username])
    .then(function(data) {
      var user = data.id;

      passport.bcrypt.compare(password, data.hashed_password).then(function(result) {
        if (result) {
          console.log('utente autenticato');
          return done(null, user);
        } else {
          console.log('utente NON autenticato: password errata');
          return done(null, false);
        }
      });
    })
    .catch(function(error) {
      console.log(error)
      console.log('utente NON autenticato: utente sconosciuto');
      return done(null, false);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  db.one(
    'SELECT p.id, p.codice_fiscale ' +
    'FROM persone p ' +
    'WHERE p.id = $1',
    [id]
  )
  .then(function(data) {
    var user = data;
    return done(null, user);
  })
  .catch(function(error) {
    return done(null, false);
  });
});

module.exports = {
  passport: passport
}
