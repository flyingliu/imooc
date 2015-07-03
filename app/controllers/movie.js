var Movie = require('../models/movie');
var Catetory = require('../models/catetory');
var Comment = require('../models/comment');
var _ = require('underscore');


exports.detail = function(req,res){
  var id = req.params.id;
  Movie.findById(id, function(err, movie){
    Comment
      .find({movie: id})
      .populate('from','name')
      .populate('reply.from reply.to', 'name')
      .exec(function(err, comments){
        res.render('detail',{
          title:'imooc detail',
          movie: movie,
          comments: comments
        })
      })
  })
}

exports.new = function(req,res){
  Catetory.find({}, function(err, catetories){
    res.render('admin',{
      title:'imooc admin',
      catetories:catetories,
      movie: {}
      });
  })
}


exports.del = function(req, res){
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
}

// admin updata movie

exports.updata = function(req,res){
  var id = req.params.id;
  if(id) {
    Movie.findById(id, function(err, movie) {
      Catetory.find({}, function(err, catetories){
        res.render('admin', {
          title: 'imooc 后台更新页',
          movie: movie,
          catetories:catetories
        })
      })
    })
  }
}


// admin post movie 
exports.save = function(req, res) {
  var id = req.body.movie._id;
  var movieObj = req.body.movie;
  var _movie;
  if (id) {
    Movie.findById(id, function(err, movie){
      if (err) console.log(err);
      _movie = _.extend(movie, movieObj);
      var catetoryId = _movie.catetory;
      _movie.save(function(err, movie){
        if (err) console.log(err);
        Catetory.findById(catetoryId, function(err, catetory){
          catetory.movies.push(movie._id);
          catetory.save(function(err, catetory){
            res.redirect('/movie/' + movie._id);
          });
        });
      });
    })
  }
  else {
    _movie = new Movie(movieObj);
    var catetoryId = _movie.catetory;
    _movie.save(function(err, movie){
      if (err) console.log(err);
      Catetory.findById(catetoryId, function(err, catetory){
        catetory.movies.push(movie._id);
        catetory.save(function(err, catetory){
          res.redirect('/movie/' + movie._id);
        });
      });
    });
  }
}


exports.list = function(req,res){
  Movie.fetch(function(err,movies) {
    if (err) {
      console.log(err);
    }
    res.render('list',{
      title:'imooc list',
      movies:movies
    });
  })
}