/**
 * 名家
 */
var express = require('express');
var router = express.Router();
var oplabelDao = require('../dao/oplabelDao');
var opoemDao = require('../dao/opoemDao');
var utils = require('../utils/utils'); 
var httputil = require('../utils/httputil'); 
var ru = require('../utils/routersutil');
var logger = require('../utils/log4jsutil').logger(__dirname+'/banner.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
    res.send('famous');
});

router.post('/oplabels', function(req, res, next) {
  ru.logReq(req);
  oplabelDao.queryOPLabels(function(err,result){
      if(err){
        ru.resError(res,err);
      }else{
        ru.resSuccess(res,result);
      }
    });
});

router.post('/nopoems', function(req, res, next) {
  ru.logReq(req);
  var id = req.body.id;
  var type = req.body.type;
  var label = req.body.label;
  if(!label){
    ru.resError(res,'参数错误');
  }else{
    opoemDao.queryNewestOPoem(id,type,label,function(err,result){
      if(err){
        ru.resError(res,err);
      }else{
        ru.resSuccess(res,result);
      }
    });
  }
});

router.post('/hopoems', function(req, res, next) {
  ru.logReq(req);
  var id = req.body.id;
  var type = req.body.type;
  var label = req.body.label;
  if(!label){
    ru.resError(res,'参数错误');
  }else{
    opoemDao.queryHistoryOPoem(id,type,label,function(err,result){
        if(err){
          ru.resError(res,err);
        }else{
          ru.resSuccess(res,result);
        }
      });
  }
});

router.post('/search', function(req, res, next) {
  ru.logReq(req);
  var search = req.body.search;
  if(!search){
    ru.resError(res,'参数错误');
  }else{
    opoemDao.querySearchOPoem(search,function(err,result){
        if(err){
          ru.resError(res,err);
        }else{
          ru.resSuccess(res,result);
        }
      });
  }
});


router.post('/opoem', function(req, res, next) {
  ru.logReq(req);
  var id = req.body.id;
  var userid = req.body.userid;
  if(!id){
    ru.resError(res,'参数错误');
  }else{
    opoemDao.queryOPoem(userid,id,function(err,result){
        if(err){
          ru.resError(res,err);
        }else{
          ru.resSuccess(res,result);
        }
      });
  }
});


router.post('/author', function(req, res, next) {
  ru.logReq(req);
  var author = req.body.author;
  if(!author){
    ru.resError(res,'参数错误');
  }else{
    oplabelDao.queryAuthor(author,function(err,result){
        if(err){
          ru.resError(res,err);
        }else{
          var opoem = {};
          if(result.length > 0){
            opoem = result[0];
          }
          ru.resSuccess(res,opoem);
        }
      });
  }
});


module.exports = router;