var User = require('../models/user');

// user signup
exports.signup =  function(req,res) {
  var _user = req.body.user;
  User.find({name: _user.name}, function(err, user) {
    if (err) {
      console.log(err);
    }
    if(user.length) {
      return res.redirect('/signin')
    } else {
      var user = new User(_user);
      user.save(function(err, user){
        if(err) {
          console.log(err);
        }
        res.redirect('/')
      });
    }
  })
}

// user signin
exports.signin = function(req, res) {
  var _user = req.body.user;
  var name = _user.name;
  var password = _user.password;
  User.findOne({name: name,password: password}, function(err, user) {
    if (err) console.log(err);
    if (!user) return res.redirect('/signup');
    req.session.user = user;
    return res.redirect('/');
  });
}

// user showsignup
exports.showsignup =  function(req,res) {
  res.render('signup',{
    title:'注册'
  });
}

// user showsignin
exports.showsignin = function(req, res) {
  res.render('signin',{
    title:'登录'
  });
}


// user logout
exports.logout = function(req, res) {
  delete req.session.user;
  // delete app.locals.user;
  res.redirect('/');
}


//user list

exports.list = function(req,res){
  User.fetch(function(err,Users) {
    if (err) {
      console.log(err);
    }
    res.render('userlist',{
      title:'imooc userlist',
      users:Users
    });
  })
}


//user signinReq

exports.signinReq = function(req,res, next){
  var user = req.session.user;
  if(!user) return res.redirect('/signin');
  next();
}

//user adminReq
exports.adminReq = function(req,res, next){
  var user = req.session.user;
  if(user.role <= 10) return res.redirect('/signin');
  next();
}

