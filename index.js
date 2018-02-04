// Include modules
const express              = require('express');
const bodyParser           = require('body-parser');
const passport             = require('passport');
const jwt                  = require('jsonwebtoken');
const nodemailer           = require('nodemailer');
const morgan               = require('morgan');
const methodOverride       = require('method-override');
const path                 = require('path');
const fs                   = require('fs');
const cors                 = require('cors');
const compression          = require('compression');
const btoa                 = require('btoa');
const checkToken           = require('./utils/checkOauthToken');
const check_permissions    = require('./utils/rbac');

//Include Routes
const Goods = require('./routes/goods');


// Run express
const app = express();

app.set('secretKey', 'VG1wVk1FNTZVVEpPVlU5VVZUQk9hazE1VGtSRlBRPT0=');
// Включение кроссдоменных запросов
app.use(cors());


let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
// Write all calls to the log file
app.use(morgan('combined', {stream: accessLogStream}));
// Enable JSON parsing
app.use(bodyParser.json());
// For support put and delete HTTP methods
app.use(methodOverride());
// Compression
app.use(compression());



const mailTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'ivananufriew@gmail.com',
    pass: 'xFDg_4%SdGH#',
  }
});



app.use('/api/v1.5/goods', Goods);







// Catch 404 Http Error
app.use(function(req, res, next) {
  res.status(404).json({
    "error_code": 404,
    "error_descr" : "Not Found"
  });
});
// Catch 500 Http Error
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    "error_code": 500,
    "error_descr": "The server has been crashed"
  });
});



//
//
// app.get('/api/getIp', (req, res) => {
//   res.json({
//     "ip" : req.connection.remoteAddress
//   });
// });
//
//
// app.get('/', (req, res) => {
//   let info = {'message' : 'Error: 403 Forbidden! Use /api/goods to fetch data from the server. You can see available methods here: http://phones-shop.ga/docs/api'};
//   res.send(403, info);
// });
//
//
//
// app.get('/api', (req, res) => {
//   let info = {'message' : 'Error: 403 Forbidden! Use /goods to fetch data from the server'};
//   res.send(403, info);
// });
//
// app.get('/api/ads', (req, res) => {
//   Db.getAll('ads', (data) => {
//     res.json(data);
//   });
// });
//
// app.get('/api/brands', (req, res) => {
//   Db.getAll('brands', (data) => {
//     res.json(data);
//   });
// });
//
//
//
//
//
//
//
//
// app.put('/api/goods/:id', (req, res) => {
//   if(checkToken(req, res, app.get('secretKey'), jwt)) {
//     if (check_permissions(req, res, Db)) {
//       res.json({
//         success   : true,
//         message   : 'Good has been successfully updated.'
//       });
//     }
//     else {}
//   }
//   else {
//     res.json({
//       success    : false,
//       message    : 'Oops.. You don\'t have necessary rights for this operation'
//     });
//   }
// });






// Listen Server

// app.listen(8080, '104.218.120.125', () => {
//   console.log('Express server listening on port 8080 !');
// });
app.listen(8080, '127.0.0.1', () => {
  console.log('Express server listening on port 8080 !');
});
