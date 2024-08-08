const express = require('express');
const router = express.Router();

const users = require('./users.js');

router.route('/users/:iduser/isPasswordCorrect')
 .get(users.isPasswordCorrect)

router.route('/users/:iduser/editPassword')
  .post(users.editPassword)

module.exports = router;