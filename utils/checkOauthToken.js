module.exports = (req, res, secretKey, jwt) => {
  // check header or url parameters or post parameters for token
  let token = req.body.token || req.query.token || req.headers['x-access-token'];

  return new Promise((resolve, reject) => {

    // decode token
    if (token) {

      // verifies secret and checks exp
      jwt.verify(token, secretKey, function(err, decoded) {
        if (err) {
          let responseObj = { success: false, message: 'Failed to authenticate token.' };
          reject(responseObj);
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          console.log("Congratulations !");
          resolve({"message" : "You have been already authorized"});
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
