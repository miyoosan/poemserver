/**
 * 作品服务器
 */
var express = require('express');
var router = express.Router();
var bannerDao = require('../dao/bannerDao');
var utils = require('../utils/utils'); 
var httputil = require('../utils/httputil'); 
var ru = require('../utils/routersutil');
var logger = require('../utils/log4jsutil').logger(__dirname+'/banner.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
    res.send('banner');
});

router.post('/all', function(req, res, next) {
  ru.logReq(req);
  var id = req.body.id;
  bannerDao.queryNewestBanner(id,function(err,result){
      if(err){
        ru.resError(res,err);
      }else{
        ru.resSuccess(res,result);
      }
    });
});

module.exports = router;