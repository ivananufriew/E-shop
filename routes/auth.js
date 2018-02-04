const express       = require('express');
const router        = express.Router();
const bcrypt        = require('bcryptjs');

const Db            = require('../utils/db').connection();

router.post('/', (req, res) => {
  checkToken(req, res, app.get('secretKey'), jwt)
  .then(data => {
    res.json(data);
    res.json(req.cookie);
  })
  .catch(error => {
    if(req.body.login && req.body.login !=='' && req.body.password && req.body.password !=='') {
      Db.getOneEntry('users','email', req.body.login, (data) => {
        if(data) {
          let password = req.body.password || '';
          if(bcrypt.compareSync(password, data.password)){
            let generated_token = jwt.sign(
              {
                'otherKey': Math.random() * 145340.756468,
                // Если, кпримеру, злоумышленник украдет куки, в котором токен,
                // то он зайдет с другого айпи, и токен не пройдет. (защита от дурака)
                'remoteAdress': req.connection.remoteAdress
              },
              app.get('secretKey'), {
                expiresIn: 1440, // expires in 24 hours
                algorithm: 'HS384'
              });
              // Db.updateUserByToken('users', 'token', generated_token, data.user_id);
              res.json({
                'token' : generated_token
              });
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

module.exports = router;
