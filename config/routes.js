var Movie = require('../app/controllers/movie');
var User = require('../app/controllers/user');
var Index = require('../app/controllers/index');

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
  app.get('/logout', User.logout);
  app.get('/admin/userlist',User.list);

  //movie
  app.get('/movie/:id', Movie.detail);
  app.get('/admin/movie', Movie.new);
  app.delete('/admin/list', Movie.del);
  app.get('/amdin/updata/:id', Movie.updata);
  app.post('/admin/movie/new', Movie.save);
  app.get('/admin/list', Movie.list);

}

