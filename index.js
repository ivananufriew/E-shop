// Include modules
const express              = require('express');
const bodyParser           = require('body-parser');
const passport             = require('passport');
const nodemailer           = require('nodemailer');
const morgan               = require('morgan');
const methodOverride       = require('method-override');
const path                 = require('path');
const fs                   = require('fs');
const cors                 = require('cors');
const compression          = require('compression');
const btoa                 = require('btoa');
const checkToken           = require('./utils/checkOauthToken');

// Run express
const app = express();

// Enable CORS
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


// mailTransport Setup
const mailTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'ivananufriew@gmail.com',
    pass: 'xFDg_4%SdGH#',
  }
});


// Include Routes
const Goods = require('./routes/goods');
const Auth  = require('./routes/auth');


// Use Routes
app.use('/api/v1.5/goods', Goods);
app.use('/api/v1.5/auth', Auth);





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


// Listen Server
app.listen(8080, '127.0.0.1', () => {
  console.log('Express server listening on port 8080 !');
});
