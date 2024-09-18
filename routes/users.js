let {db} = require('../db/dbConnection.js');
let bcrypt = require('bcrypt');

let users = {
  initUser: function(req, res) {
    let iduser = req.params.iduser;
    db.one('SELECT idruolo FROM persone WHERE id=$1', [iduser])
    .then(function(data){
      res.status(200).json(data.idruolo);
    })
    .catch(function(error) {
      console.log('initUser error: ' + error);
      res.sendStatus(500);
    });
  },

  isPasswordCorrect: function(req, res) {
    let iduser = req.params.iduser;
    let old_pass = req.query.old_pass;

    db.one('SELECT hashed_password FROM users WHERE idpersona=$1', [iduser])
    .then(function(data) {
      var password = data.hashed_password;

      bcrypt.compare(old_pass, password).then(function(result) {
        if (result) {
          res.status(200).json({check: true});
        } else {
          res.status(200).json({check: false});
        }
      });
    })
    .catch(function(error) {
      console.log('isPasswordCorrect error: ' + error);
      res.sendStatus(500);
    });
  },

  editPassword: function(req, res) {
    let iduser = req.params.iduser;
    let new_pass = req.query.new_pass;
    const saltRounds = 10;
    try {
      bcrypt.genSalt(saltRounds, (err, salt) => {
        if(err) {
          throw err;
        }

        bcrypt.hash(new_pass, salt, (err, hash) => {
          if(err) {
            throw err;
          }

          return db.none(
              "UPDATE users "+
              "SET hashed_password=$2 "+
              "WHERE idpersona=$1",
              [iduser, hash]
          )
          .then(data => {
            res.status(200).json(data);
          })
          .catch(err => {
            throw err;
          })
        })
      })
    } catch(err) {
      console.log(err)
      res.status(500).json(err);
    }
  }
}

module.exports = users;