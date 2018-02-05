const express       = require('express');
const Router        = express.Router();
const bcrypt        = require('bcryptjs');
const Path          = require('path');
const Jwt           = require('jsonwebtoken');
const checkToken    = require('../utils/checkOauthToken');
const Sequelize     = require('../utils/db.config')();


const dir   = Path.join(__dirname, '../models');
const Users = Sequelize.import(Path.join(dir, "users.js"));



Router.post('/login', (req, res) => {

  const secretKey = 'VG1wVk1FNTZVVEpPVlU5VVZUQk9hazE1VGtSRlBRPT0='+req.connection.remoteAddress;


  checkToken(req, res, secretKey)
  .then(data => {
    res.json(data);
    res.json(req.cookie);
  })
  .catch(error => {
    if(req.body.login && req.body.login !=='' && req.body.password && req.body.password !=='') {
      Users.findOne({where: {email: req.body.login}})
      .then((data) => {
        if(data) {
          let password = req.body.password || '';
          if(bcrypt.compareSync(password, data.password)){
            let generated_token = Jwt.sign(
              {
                'otherKey': Math.random() * 145340.756468,
              },
              secretKey,
              {
                expiresIn: 1440, // expires in 24 hours
                algorithm: 'HS384'
              });

              res.json({
                'token' : generated_token
              });

              Users.update({last_login_ip: req.connection.remoteAddress, last_login: Sequelize.literal('CURRENT_TIMESTAMP')},
                { where: { user_id: data.user_id }})
                .then(() => console.log('Token updated.'))
                .catch(err => console.log('Err.'));

            }
            else {
              res.json({
                'success' : false,
                'message': 'Authorization error: Incorrect password'
              });
            }
          }
          else {
            res.json({
              'success': false,
              'message': 'Authentification failed: User with this email couldn\'t be found'
            });
          }
        });
      }
      else {
        res.json({
          'success': false,
          'message': 'Fill in the required fields'
        });
      }
    }
  );
});

module.exports = Router;
