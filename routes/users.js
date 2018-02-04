const express       = require('express');
const router        = express.Router();
const Db            = require('../utils/db');
const bcrypt        = require('bcryptjs');

app.post('/', (req, res) => {

  if(req.body.first_name !=='' &&
  req.body.surname !=='' &&
  req.body.email !=='' &&
  req.body.password !=='' &&
  req.body.confirm_password !=='') {
    let new_user = {
      user_id       : null,
      first_name    : req.body.first_name,
      sur_name      : req.body.sur_name,
      email         : req.body.email,
      role          : 'client',
      password      : bcrypt.hashSync(req.body.password),
      last_login    : null,
      token         : ''
    };
    Db.getOneEntry('users', 'email', req.body.email, (data) => {
      if(data) {
        res.json({
          'success' : false,
          'message' : 'User with this email was already registered'
        });
      }
      else {
        Db.addEntry('users', new_user, (data) => {
          if(!data.code) {

            // Send verification email
            mailTransport.sendMail({
              from: `PhonesShop' <noreply@phones-shop.ga>'`,
              to: req.body.email,
              subject: 'Your verification email from PhonesShop',
              html: `<h1>PhonesShop - Интернет магазин телефонов</h1>\n<p>Подтвердите пожалуйста регистрацию
              , нажав на ссылку ниже</p>\n
              <a href='http://phones-shop.ga/shop/#/signup/verify/'`+ btoa(req.body.email) +
              `>http://phones-shop.ga/shop/#/signup/verify/`+ btoa(req.body.email) +`</a>`,
            }, function(err){
              if(err) console.error(`Невозможно отправить письмо: ${err}`);
            });


            res.status(201).send({
              'success': true,
              'login'  : req.body.email,
              'message': 'Congratulations! You have been successfully registered.'
            });


          }
          else {
            res.json({
              'success': false,
              'message': 'An server error has occurred. We will repair this problem soon.'
            });
            console.log(data);
            console.log(req.body);
          }
        });
      }
    });
  }
  else {
    res.json({
      'success' : false,
      'message' : 'Fill in the required fields'
    });
  }
});


module.exports = router;
