const Sequelize     = require('../utils/db.config')();
const Path          = require('path');
const Jwt           = require('jsonwebtoken');

const dir = Path.join(__dirname, '../models');
const Users = Sequelize.import(Path.join(dir, "users.js"));

module.exports = (req, res, secretKey) => {
  // Check header or url parameters or post parameters for token
  let token = req.body.token || req.query.token || req.headers['x-access-token'];

  return new Promise((resolve, reject) => {

    // Decode token
    if (token) {

      // Verifies secret and checks expires
      Jwt.verify(token, secretKey, function(err, decoded) {
        if (err) {
          let responseObj = {
            success: false,
            message: 'Failed to authenticate token.'
          };
          reject(responseObj);
        } else {
          // If good, save to request for use in other routes
          req.decoded = decoded;
          resolve();
        }
      });

    } else {

      // if there is no token
      // return an error
      let responseObj = {
          success: false,
          message: 'No auth token passed.'
      };
      reject(responseObj);
    }
  });

};
