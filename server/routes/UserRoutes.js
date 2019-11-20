const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../models/user');

/*
* Route to handle LogIn attempt, expects email and password
* */
//----------------------------------------------------------
router.post('/LogIn', function (req, res) {
    let fetchedUser;
    User.findOne({strEmail: req.body.strEmail}).then((user) => {
      if(user === null) {
          return res.status(401).json({
              message: "no user found"
          });
      }

      fetchedUser = user;

      bcrypt.compare(
          req.body.strPassword,
          user.strPassword
      ).then((result) => {
          if(!result) {
              return res.status(402).json({
                  message: "password does not match"
              });
          }
          //create the JSON WEB TOKEN
          const token = jwt.sign({
              strMatricula: fetchedUser.strMatricula,
              strName: fetchedUser.strName
          }, process.env.JWT_KEY, {expiresIn: '3day'});

          return res.status(200).json({
              token: token,
              strName: fetchedUser.strName,
              strMatricula: fetchedUser.strMatricula
          });
      });
    }).catch((error) => {
      return res.status(500).json({
        message: error
      });
    });
});

/*
* Handle Sing up attempt, expects matricula, name, email
*   and password
* */
//----------------------------------------------------------
router.post('/SingUp', (req, res, next) => {

  if(
    !req.body.strMatricula ||
    !req.body.strName      ||
    !req.body.strEmail     ||
    !req.body.strPassword
  ) {
    return res.status(400).json({
      message: "missing a field"
    });
  }

  bcrypt.hash(req.body.strPassword, 10).then(hash => {

      const user = new User({
          strMatricula: req.body.strMatricula,
          strName: req.body.strName,
          strEmail: req.body.strEmail,
          strPassword: hash
      });

      user.save().then((result) => {
          return res.status(200).json({
              message: "User created!"
          });
      }).catch((err) => {
          return res.status(400).json({
              message: "a user already exists"
          });
      });

  });
});

module.exports = router;
