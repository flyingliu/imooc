var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var logger = require('morgan');
var multer = require('multer');
var mongoose = require('mongoose');

var serveStatic = require('serve-static');
var port = process.env.PORT || 3000;
var app = express();
var dbUrl = 'mongodb://imooc:fly2431757@ds041188.mongolab.com:41188/imooc';
if(process.env.NODE_ENV === "dev") {
  mongoose.connect(dbUrl);
  app.set('showStackError', true);
  // app.use(logger('dev'));
  app.locals.pretty = true;
  mongoose.set('debug', true);
} else {
  mongoose.connect(dbUrl);
}

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data
app.locals.moment = require('moment');
app.use(cookieParser());
app.use(session({
  secret: 'imooc',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  })
}))

app.set('views','./app/views/pages')
app.set('view engine','jade');
// app.use(express.bodyParse());
app.use(serveStatic(__dirname, 'bower_components'));
app.use(serveStatic(__dirname, 'public'));
app.listen(port);

console.log('imooc started on port' + port);

require('./config/routes')(app);


