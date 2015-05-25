var Movie = require('../app/controllers/movie');
var User = require('../app/controllers/user');
var Index = require('../app/controllers/index');
var Comment = require('../app/controllers/comment');

module.exports = function(app) {
  app.use(function(req,res,next){
    // console.log(req.session.user);
    var _user = req.session.user;
    app.locals.user = _user;
    next();
  })

  app.get('/',Index.index);

  // user 
  app.post('/user/signup',User.signup)
  app.post('/user/signin',User.signin);
  app.get('/signup',User.showsignup);
  app.get('/signin',User.showsignin);
  app.get('/logout', User.logout);
  app.get('/admin/user/list',User.signinReq, User.adminReq, User.list);

  //movie
  app.get('/movie/:id', Movie.detail);
  app.get('/admin/movie/new', User.signinReq, User.adminReq, Movie.new);
  app.delete('/admin/movie/list', User.signinReq, User.adminReq, Movie.del);
  app.get('/amdin/movie/updata/:id', User.signinReq, User.adminReq, Movie.updata);
  app.post('/admin/movie/new', User.signinReq, User.adminReq, Movie.save);
  app.get('/admin/movie/list', User.signinReq, User.adminReq, Movie.list);

  //comment
  app.post('/user/comment', User.signinReq, Comment.save);

}

