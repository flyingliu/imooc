var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);

var multer = require('multer');
var mongoose = require('mongoose');
var Movie = require('./models/movie');
var User = require('./models/user');
var _ = require('underscore');
var serveStatic = require('serve-static');
var port = process.env.PORT || 3000;
var app = express();
var dbUrl = 'mongodb://imooc:fly2431757@ds041188.mongolab.com:41188/imooc';
if(process.env.NODE_ENV === "development") {
  mongoose.connect('mongodb://localhost/imooc');
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



app.set('views','./views/pages')
app.set('view engine','jade');
// app.use(express.bodyParse());
app.use(serveStatic(__dirname, 'bower_components'));
app.use(serveStatic(__dirname, 'public'));
app.listen(port);

console.log('imooc started on port' + port);

app.get('/',function(req,res){
  console.log(req.session.user);
  Movie.fetch(function(err,movies) {
    if (err) {
      console.log(err);
    }
    res.render('index',{
      title:'imooc index',
      movies:movies
    });
  })
})

// user signup
app.post('/user/signup', function(req,res) {
  var _user = req.body.user;
  User.find({name: _user.name}, function(err, user) {
    if (err) {
      console.log(err);
    }
    if(user.length) {
      return res.redirect('/')
    } else {
      var user = new User(_user);
      user.save(function(err, user){
        if(err) {
          console.log(err);
        }
        res.redirect('/admin/userlist')
      });
    }
  })

})


// user signin
app.post('/user/signin', function(req, res) {
  var _user = req.body.user;
  var name = _user.name;
  var password = _user.password;
  User.findOne({name: name,password: password}, function(err, user) {
    if (err) console.log(err);
    if (!user) return res.redirect('/admin/list');
    req.session.user = user;
    return res.redirect('/');
  });
})

//user list

app.get('/admin/userlist',function(req,res){
  User.fetch(function(err,Users) {
    if (err) {
      console.log(err);
    }
    res.render('userlist',{
      title:'imooc userlist',
      users:Users
    });
  })
})






app.get('/movie/:id',function(req,res){
  var id = req.params.id;
  Movie.findById(id, function(err, movie){
    if (err) {
      console.log(err);
    }
    res.render('detail',{
      title:'imooc detail',
      movie: movie
    });
  })
})

app.get('/admin/movie',function(req,res){
  res.render('admin',{
    title:'imooc admin',
    movie: {
      doctor: '', 
      country: '', 
      title: '',
      year: '', 
      poster:'', 
      language: '', 
      flash: '', 
      summary: '' 
      }
    });
})


app.delete('/admin/list',function(req, res){
  var id = req.query.id;
  console.log(id);
  if (id) {
    Movie.remove({_id: id}, function(err, movie){
      if(err) {
        console.log(err);
      }
      else {
        res.json({success: 1});
      }
    })
  }
});

// admin updata movie

app.get('/amdin/updata/:id', function(req,res){
  var id = req.params.id;
  if(id) {
    Movie.findById(id, function(err, movie) {
      res.render('admin', {
        title: 'imooc 后台更新页',
        movie: movie
      })
    })
  }

});


// admin post movie 
app.post('/admin/movie/new', function(req, res) {
  var id = req.body.movie._id;
  var movieObj = req.body.movie;
  var _movie;
  if (id !== 'undefined') {
    Movie.findById(id, function(err, movie){
      if (err) {
        console.log(err);
      }
      _movie = _.extend(movie, movieObj);
      _movie.save(function(err, movie){
        if (err) {
          console.log(err);
        }
        res.redirect('/movie/' + movie._id);
      });
    })
  }
  else {
    _movie = new Movie({
      doctor: movieObj.doctor,
      title: movieObj.title,
      country: movieObj.country,
      language: movieObj.language,
      year: movieObj.year,
      poster: movieObj.poster,
      summary: movieObj.summary,
      flash: movieObj.flash
    })
    _movie.save(function(err, movie){
      if (err) {
        console.log(err);
      }
      res.redirect('/movie/' + movie._id);
    });
  }
})


app.get('/admin/list',function(req,res){
  Movie.fetch(function(err,movies) {
    if (err) {
      console.log(err);
    }
    res.render('list',{
      title:'imooc list',
      movies:movies
    });
  })
})



