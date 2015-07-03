var Catetory = require('../models/catetory');
var _ = require('underscore');

exports.new = function(req,res){
  res.render('catetory_admin',{
    title:'imooc 分类录入',
    catetory: {}
    });
}


// admin post catetory 
exports.save = function(req, res) {
  var _catetory = req.body.catetory;
  var catetory = new Catetory(_catetory);
  catetory.save(function(err, catetory){
    if (err) console.log(err);
    res.redirect('/admin/catetory/list');
  });

}


exports.list = function(req,res){
  Catetory.fetch(function(err,catetories) {
    if (err) {
      console.log(err);
    }
    res.render('catetorylist',{
      title:'imooc catetorylist',
      catetories:catetories
    });
  })
}