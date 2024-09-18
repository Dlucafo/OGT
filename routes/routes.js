const express = require('express');
const users = require('./users.js');

const router = express.Router();

router.route('/v1.0/users/:iduser')
 .get(users.initUser)

router.route('/v1.0/users/:iduser/isPasswordCorrect')
 .get(users.isPasswordCorrect)

router.route('/v1.0/users/:iduser/editPassword')
  .post(users.editPassword)

module.exports = router;